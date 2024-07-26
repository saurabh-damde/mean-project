import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';
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
    this.http
      .get<any[]>(`${this.apiUrl}/posts`)
      .pipe(
        map((posts) =>
          posts.map((post) => {
            return { ...post, id: post._id };
          })
        )
      )
      .subscribe((posts) => {
        this.posts = posts;
        this.postsUpdate.next(this.posts.slice());
      });
  }

  getPostsSubscription() {
    return this.postsUpdate.asObservable();
  }

  addPost(post: Post) {
    this.http
      .post<{ message: string; post: any }>(`${this.apiUrl}/posts`, post)
      .subscribe((res) => {
        console.log(res);
        post.id = res.post._id;
        this.posts.push(post);
        this.postsUpdate.next(this.posts.slice());
      });
  }

  deletePost(id: string) {
    this.http.delete(`${this.apiUrl}/posts/${id}`).subscribe(() => {
      this.posts = this.posts.filter((post) => post.id !== id);
      this.postsUpdate.next(this.posts.slice());
    });
  }
}
