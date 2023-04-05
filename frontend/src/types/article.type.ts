import {CommentUserType} from "./comment-user.type";

export type ArticleType = {
  id: string,
  title: string,
  description: string,
  image: string,
  date: string,
  category: string,
  url: string,
  text: string,
  comments: CommentUserType[],
  commentsCount?: number,
}
