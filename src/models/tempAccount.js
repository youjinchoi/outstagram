const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// tempAccount와 account는 거의 동일한 스키마를 가진다. temp는 유저가 검색했을 때 결과를 임시로 저장해두었다가 실제 follow시 temp의 데이터를 account에 옮기게 된다
const tempAccountSchema = new Schema({
	sId: {type: String, index: true, required: true},	// sns 계정 id
	type: {type: Number, index: true},	// sns 타입. 현재는 인스타그램만 가능
	sKey: String,	// sns에서 id 외에 계정에 부여하는 유니크한 식별자(탈퇴한 id로 다른사람이 가입하였을 때 발생할 수 있는 오류 예방 차원)
	title: String,	// og:title
	image: String,	// og:image
	description: String,	// og:description
	url: String,	// og:url
	updateDate: Date,	// 최신글 업데이트일
});

module.exports = mongoose.model('tempAccount', tempAccountSchema);