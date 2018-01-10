const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
	seq: {type: Number, index:true, unique: true, required: true},
	type: Number,	// sns 타입. 현재는 인스타그램만 가능
	sId: String,	// sns 계정 id
	sKey: String,	// sns에서 id 외에 계정에 부여하는 유니크한 식별자(탈퇴한 id로 다른사람이 가입하였을 때 발생할 수 있는 오류 예방 차원)
	title: String,	// og:title
	image: String,	// og:image
	description: String,	// og:description
	url: String,	// og:url
	updateDate: Date,	// 최신글 업데이트일
	followerCount: {type: Number, default: 0}
});

module.exports = mongoose.model('account', accountSchema);