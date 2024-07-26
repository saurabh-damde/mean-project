import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Subject } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private apiUrl = 'http://localhost:3000/api';
  private posts: Post[] = [];
  private postsUpdate = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

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

  getPost(id: string) {
    return this.http.get<{ _id: string; title: string; content: string }>(
      `${this.apiUrl}/posts/${id}`
    );
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
        this.router.navigate(['/']);
      });
  }

  updatePost(post: Post) {
    this.http.put(`${this.apiUrl}/posts/${post.id}`, post).subscribe(() => {
      const postInx = this.posts.findIndex((item) => item.id == post.id);
      if (postInx) {
        this.posts[postInx] = post;
      } else {
        this.posts.push(post);
      }
      this.postsUpdate.next(this.posts);
      this.router.navigate(['/']);
    });
  }

  deletePost(id: string) {
    this.http.delete(`${this.apiUrl}/posts/${id}`).subscribe(() => {
      this.posts = this.posts.filter((post) => post.id !== id);
      this.postsUpdate.next(this.posts.slice());
    });
  }
}
