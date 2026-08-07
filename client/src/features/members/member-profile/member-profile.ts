import {
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { EditableMember, Member } from '../../../types/member';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../core/services/member-service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../core/services/toast-service';
import { AccountService } from '../../../core/services/account-service';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe, FormsModule, TimeAgoPipe],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css',
})
export class MemberProfile implements OnInit, OnDestroy {
  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notity($event: BeforeUnloadEvent) {
    if (this.editForm?.dirty) {
      $event.preventDefault();
    }
  }
  private accountSrvice = inject(AccountService);
  protected memberService = inject(MemberService);
  private toast = inject(ToastService);
  protected editbleMember: EditableMember = {
    displayName: '',
    description: '',
    city: '',
    country: '',
  };

  ngOnInit(): void {
    this.editbleMember = {
      displayName: this.memberService.member()?.displayName || '',
      description: this.memberService.member()?.description || '',
      city: this.memberService.member()?.city || '',
      country: this.memberService.member()?.country || '',
    };
  }

  ngOnDestroy(): void {
    if (this.memberService.editMode()) {
      this.memberService.editMode.set(false);
    }
  }

  updateProfile() {
    if (!this.memberService.member()) return;
    const updateMember = { ...this.memberService.member(), ...this.editbleMember };
    this.memberService.updateMember(this.editbleMember).subscribe({
      next: () => {
        const currentUsr = this.accountSrvice.currentUser();
        if (currentUsr && updateMember.displayName !== currentUsr?.displayName) {
          currentUsr.displayName = updateMember.displayName;
          this.accountSrvice.setCurrentUser(currentUsr);
        }
        this.toast.success('Profile updated successfully');
        this.memberService.editMode.set(false);
        this.memberService.member.set(updateMember as Member);
        this.editForm?.reset(updateMember);
      },
    });
  }
}
