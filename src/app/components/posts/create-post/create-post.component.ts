import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../../../models/post.model';
import { PostsService } from '../../../services/posts.service';
import { mimeType } from '../../../utils/mime-types.validator';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css',
})
export class CreatePostComponent implements OnInit {
  private mode: 'create' | 'edit' = 'create';
  private postId: string;
  form: FormGroup;
  post: Post;
  imagePrev: string;
  isLoading: boolean = false;

  constructor(
    private postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.postId = paramMap.get('id');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe((post) => {
          this.isLoading = false;
          this.post = {
            id: post._id,
            title: post.title,
            content: post.content,
            imagePath: post.imagePath,
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath,
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.imagePrev = fileReader.result as string;
    };
    fileReader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    const post: Post = {
      id: null,
      title: this.form.value.title,
      content: this.form.value.content,
      imagePath: null,
    };
    if (this.mode === 'create') {
      this.postsService.addPost(post, this.form.value.image);
    } else {
      post.id = this.postId;
      this.postsService.updatePost(post, this.form.value.image);
    }
    this.form.reset();
  }
}
