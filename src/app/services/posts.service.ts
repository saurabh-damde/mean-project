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
  private postsUpdate = new Subject<{ posts: Post[]; total: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(pageSize: number, page: number) {
    const queryParams = `?pageSize=${pageSize}&page=${page}`;
    this.http
      .get<{ total: number; posts: any[] }>(
        `${this.apiUrl}/posts${queryParams}`
      )
      .pipe(
        map((postsData) => {
          return {
            total: postsData.total,
            posts: postsData.posts.map((post) => {
              return { ...post, id: post._id };
            }),
          };
        })
      )
      .subscribe((postsData) => {
        this.posts = postsData.posts;
        this.postsUpdate.next({
          posts: this.posts.slice(),
          total: postsData.total,
        });
      });
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
    }>(`${this.apiUrl}/posts/${id}`);
  }

  getPostsSubscription() {
    return this.postsUpdate.asObservable();
  }

  addPost(post: Post, image: File) {
    const { title, content } = post;
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{ message: string; post: any }>(`${this.apiUrl}/posts`, postData)
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  updatePost(post: Post, image: File | string) {
    const { id, title, content } = post;
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = { ...post, imagePath: image };
    }
    this.http.put(`${this.apiUrl}/posts/${id}`, postData).subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  deletePost(id: string) {
    return this.http.delete(`${this.apiUrl}/posts/${id}`);
  }
}
