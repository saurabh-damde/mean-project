import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Post } from '../../../models/post.model';
import { AuthService } from '../../../services/auth.service';
import { PostsService } from '../../../services/posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription;
  private postsSub: Subscription;
  authenticated: boolean;
  posts: Post[] = [];
  isLoading: boolean = false;
  totalPosts: number;
  pageSize = 3;
  currentPage = 1;
  // pageSizeOptions = [5, 10, 15];
  pageSizeOptions = [1, 3, 5];

  constructor(
    private postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.pageSize, this.currentPage);
    this.postsSub = this.postsService
      .getPostsSubscription()
      .subscribe((postsData: { posts: Post[]; total: number }) => {
        this.posts = postsData.posts;
        this.totalPosts = postsData.total;
        this.isLoading = false;
      });
    this.authenticated = this.authService.isAuthenticated();
    this.authStatusSub = this.authService
      .getAuthStatus()
      .subscribe((authenticated) => (this.authenticated = authenticated));
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.pageSize = pageData.pageSize;
    this.postsService.getPosts(this.pageSize, this.currentPage);
  }

  onDelete(id: string) {
    this.isLoading = true;
    this.postsService.deletePost(id).subscribe(() => {
      this.postsService.getPosts(this.pageSize, this.currentPage);
    });
  }
}
