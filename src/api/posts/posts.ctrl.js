import Post from '../../models/post';
import mongoose from 'mongoose';
import Joi from '../../../node_modules/joi/lib/index';

const { ObjectId } = mongoose.Types;

export const checkObjectId = (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400; // Bad Request
    return;
  }
  return next();
};

let postId = 1; // id의 초깃값입니다.

// posts 배열 초기 데이터
const posts = [
  {
    id: 1,
    title: '제목',
    body: '내용',
  },
];

/* 포스트 작성
POST /api/posts
{ title, body }
*/
export const write = async ctx => {
  const schema = Joi.object().keys({
    // 객체가 다음 필드를 가지고 있음을 검증
    title: Joi.string().required(), // required()가 있으면 필수 항목
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(), // 문자열로 이루어진 배열
  });

  // 검증하고 나서 검증 실패인 경우 에러 처리
  const validation = schema.validate(ctx.request.body); // <- const result = Joi.validate(ctx.request.body, schema);

  if (validation.error) {
    ctx.status = 400; // Bad Request
    ctx.body = validation.error; // <- ctx.body = result.error;
    return;
  }

  const { title, body, tags } = ctx.request.body;

  // 포스트 인스턴스를 만들 떄 new 키워드를 사용한다.
  // 생성자 함수 파라미터에 객체를 넣는다.
  const post = new Post({
    title,
    body,
    tags,
  });

  try {
    // save() 실행시켜 데이터베이스에 저장한다.
    await post.save();
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* 포스트 목록 조회
GET /api/posts
*/
export const list = async ctx => {
  try {
    // find() 사용하여 데이터를 조회한다.
    // exec()를 붙여야 서버에 쿼리를 요청한다.
    const posts = await Post.find().exec();
    ctx.body = posts;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* 특정 포스트 조회
GET /api/posts/:id
*/
export const read = async ctx => {
  const { id } = ctx.params;
  try {
    const post = await Post.findById(id).exec();
    if (!post) {
      ctx.status = 404; // Not found
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* 특정 포스트 제거
DELETE /api/posts/:id
*/
export const remove = async ctx => {
  const { id } = ctx.params;

  // remove(): 특정 조건을 만족하는 데이터를 모두 지운다.
  // findByIdAndRemove() : id를 찾아 지운다.
  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204; // No Content (성공하기는 했지만 응답할 데이터는 없음)
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* 포스트 수정(특정 필드 변경)
PATCH /api/posts/:id
{ title, body }
*/
export const update = async ctx => {
  const { id } = ctx.params;

  const schema = Joi.object().keys({
    // write에서 사용한 schema와 비슷한데, required()가 없습니다.
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  });

  // 검증하고 나서 검증 실패인 경우 에러 처리
  const validation = schema.validate(ctx.request.body);

  if (validation.error) {
    ctx.status = 400; // Bad Request
    ctx.body = validation.error;
    return;
  }

  // findByIdAndUpdate()
  // 첫 번째 파라미터 : id
  // 두 번째 파라미터 : 업데이트 내용
  // 세 번째 파라미터 : 업데이트 옵션
  try {
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true, // 이 값을 설정하면 업데이트된 데이터를 반환합니다.
      // false일 떄는 업데이트되기 전의 데이터를 반환합니다.
    }).exec();

    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};
