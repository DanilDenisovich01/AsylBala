const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let conn = null;

const uri = process.env.MONGODB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'editor'], default: 'editor' }
});

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (conn == null) {
    conn = await mongoose.createConnection(uri, options);
    conn.model('User', userSchema);
  }

  const User = conn.model('User');

  const { action, username, password, role } = JSON.parse(event.body);

  if (action === 'register') {
    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return { statusCode: 400, body: JSON.stringify({ message: 'User already exists' }) };
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({ username, password: hashedPassword, role });
      await user.save();

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
      return { statusCode: 200, body: JSON.stringify({ token }) };
    } catch (error) {
      return { statusCode: 500, body: JSON.stringify({ message: 'Server error' }) };
    }
  } else if (action === 'login') {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return { statusCode: 400, body: JSON.stringify({ message: 'Invalid username or password' }) };
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return { statusCode: 400, body: JSON.stringify({ message: 'Invalid username or password' }) };
      }

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
      return { statusCode: 200, body: JSON.stringify({ token }) };
    } catch (error) {
      return { statusCode: 500, body: JSON.stringify({ message: 'Server error' }) };
    }
  }

  return { statusCode: 400, body: JSON.stringify({ message: 'Invalid action' }) };
};