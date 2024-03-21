import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SocialMediaRoutingModule } from './social-media-routing.module';
import { PostsService } from './services/post.service';
import { PostResolver } from './resolvers/posts.resolver';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostListItemComponent } from './components/post-list-item/post-list-item.component';

@NgModule({
  declarations: [PostListComponent, PostListItemComponent],
  imports: [CommonModule, SocialMediaRoutingModule],
  providers: [PostsService, PostResolver],
})
export class SocialMediaModule {}
