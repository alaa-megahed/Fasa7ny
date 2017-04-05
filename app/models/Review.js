var mongoose      = require('mongoose'),
    Schema        = mongoose.Schema;

var ReplySchema = new Schema({
  reply: String,
  timestamp: {type: Date, default: new Date() },
  business    : {type: mongoose.Schema.Types.ObjectId, ref:'Business'},
  user        : {type: mongoose.Schema.Types.ObjectId, ref:'RegisteredUser'},
  review      : {type: mongoose.Schema.Types.ObjectId, ref:'Review'}
});

var ReviewSchema = new Schema({
    review      : String,
    timestamp   : {type: Date, default: new Date() },
    replies     : [{type: mongoose.Schema.Types.ObjectId, ref:'Reply', default:[]}],
    upvote      : Number,
    downvote    : Number,
    business    : {type: mongoose.Schema.Types.ObjectId, ref:'Business'},
    user        : {type: mongoose.Schema.Types.ObjectId, ref:'RegisteredUser'},
    upvotes     : [{type: mongoose.Schema.Types.ObjectId, ref:'RegisteredUser', default:[]}],
    downvotes   : [{type: mongoose.Schema.Types.ObjectId, ref:'RegisteredUser', default:[]}]
});

var Reply = mongoose.model('Reply', ReplySchema);
var Review = mongoose.model('Review', ReviewSchema);
module.exports = {
  Reply: Reply,
  Review: Review
}
