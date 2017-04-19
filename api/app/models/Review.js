var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  RegisteredUserSchema = require('./RegisteredUser').RegisteredUserSchema,
  BusinessSchema = require('./Business').BusinessSchema;

var ReplySchema = new Schema({
  reply: String,
  timestamp: { type: Date, default: new Date() },
  authorType: String,
  user: RegisteredUserSchema,
  review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' }
});

var Reply = mongoose.model('Reply', ReplySchema);
var ReviewSchema = new Schema({
  review: String,
  timestamp: { type: Date, default: new Date() },
  replies: [ReplySchema],
  upvote: Number,
  downvote: Number,
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
  user: RegisteredUserSchema,
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RegisteredUser', default: [] }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RegisteredUser', default: [] }]
});


var Review = mongoose.model('Review', ReviewSchema);
module.exports = {
  Reply: Reply,
  Review: Review,
  ReviewSchema: ReviewSchema,
  ReplySchema: ReplySchema
}
