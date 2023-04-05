import {CommentUserType} from "./comment-user.type";

export type CommentResponseType = {
  allCount: number,
  comments: CommentUserType[];
}
