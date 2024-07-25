import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private apiUrl = 'http://localhost:3000/api';
  private posts: Post[] = [];
  private postsUpdate = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http.get<Post[]>(`${this.apiUrl}/posts`).subscribe((data) => {
      this.posts = data;
      this.postsUpdate.next(this.posts.slice());
    });
  }

  getPostsSubscription() {
    return this.postsUpdate.asObservable();
  }

  addPost(post: Post) {
    this.http.post<Post>(`${this.apiUrl}/posts`, post).subscribe((res) => {
      console.log(res);
      this.posts.push(post);
      this.postsUpdate.next(this.posts.slice());
    });
  }
}
