import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../../../models/post.model';
import { PostsService } from '../../../services/posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  postsSub: Subscription;

  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    this.postsService.getPosts();
    this.postsSub = this.postsService
      .getPostsSubscription()
      .subscribe((posts: Post[]) => (this.posts = posts));
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

  onDelete(id: string) {
    this.postsService.deletePost(id);
  }
}
