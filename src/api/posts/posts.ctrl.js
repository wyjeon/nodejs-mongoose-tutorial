import Post from '../../models/post';

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
export const remove = ctx => {};

/* 포스트 수정(특정 필드 변경)
PATCH /api/posts/:id
{ title, body }
*/
export const update = ctx => {};
