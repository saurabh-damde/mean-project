import { Injectable } from '@angular/core';
import { Post } from '../models/post.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdate = new Subject<Post[]>();

  constructor() {}

  getPosts() {
    return this.posts.slice();
  }

  getPostsSubscription() {
    return this.postsUpdate.asObservable();
  }

  addPost(post: Post) {
    this.posts.push(post);
    this.postsUpdate.next(this.posts.slice());
  }
}
