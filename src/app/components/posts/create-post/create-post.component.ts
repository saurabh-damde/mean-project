import { Component, EventEmitter, Output } from '@angular/core';
import { Post } from '../../../models/post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../../../services/posts.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css',
})
export class CreatePostComponent {
  constructor(private postsService: PostsService) {}

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const post: Post = { title: form.value.title, content: form.value.content };
    this.postsService.addPost(post);
    form.resetForm();
  }
}
