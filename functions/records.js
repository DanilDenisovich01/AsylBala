const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

let conn = null;

const uri = process.env.MONGODB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const recordSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (conn == null) {
    conn = await mongoose.createConnection(uri, options);
    conn.model('Record', recordSchema);
  }

  const Record = conn.model('Record');

  const token = event.headers.authorization.split(' ')[1];
  let user;

  try {
    user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return { statusCode: 401, body: JSON.stringify({ message: 'Unauthorized' }) };
  }

  if (event.httpMethod === 'GET') {
    try {
      const records = await Record.find().populate('createdBy', 'username');
      return { statusCode: 200, body: JSON.stringify(records) };
    } catch (error) {
      return { statusCode: 500, body: JSON.stringify({ message: 'Server error' }) };
    }
  } else if (event.httpMethod === 'POST') {
    try {
      const { title, content } = JSON.parse(event.body);
      const record = new Record({ title, content, createdBy: user.id });
      await record.save();
      return { statusCode: 200, body: JSON.stringify(record) };
    } catch (error) {
      return { statusCode: 500, body: JSON.stringify({ message: 'Server error' }) };
    }
  } else if (event.httpMethod === 'DELETE') {
    try {
      const id = event.queryStringParameters.id;
      const record = await Record.findById(id);
      
      if (!record) {
        return { statusCode: 404, body: JSON.stringify({ message: 'Record not found' }) };
      }

      if (user.role !== 'admin' && record.createdBy.toString() !== user.id) {
        return { statusCode: 403, body: JSON.stringify({ message: 'Access denied' }) };
      }

      await Record.findByIdAndDelete(id);
      return { statusCode: 200, body: JSON.stringify({ message: 'Record deleted successfully' }) };
    } catch (error) {
      return { statusCode: 500, body: JSON.stringify({ message: 'Server error' }) };
    }
  }

  return { statusCode: 400, body: JSON.stringify({ message: 'Invalid method' }) };
};