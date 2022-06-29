const mongoose = require('mongoose');

module.exports.createObjectId = (id) => {
	return new mongoose.Types.ObjectId(id);
}
