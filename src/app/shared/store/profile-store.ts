import { AuthService } from '../services/auth/auth.service';
import { UserLogin } from './../../models/user.model';
import { Store } from './store';
import { Injectable } from '@angular/core';

export interface Profile {
    completedProfile: boolean;
    user: UserLogin;
    firstName: string;
    lastName: string;
}

@Injectable()
export class ProfileStore extends Store<any> {
    constructor(private service: AuthService) {
        super({
            completedProfile: service.completedProfile(),
            user: service.getUser(),
            firstName: service.getUser()?.first_name ?? null,
            lastName: service.getUser()?.last_name ?? null,
        });
    }

    setStatus(): void {
        this.setState({
            user: this.service.getUser(),
            completedProfile: this.service.completedProfile(),
            firstName: (() => {
                const user = this.service.getUser();
                return user ? user.first_name : null;
            })(),
            lastName: (() => {
                const user = this.service.getUser();
                return user ? user.last_name : null;
            })(),
        });
    }

    setNames(firstName: string, surname: string): void {
        this.setState({
            user: this.service.getUser(),
            completedProfile: this.service.completedProfile(),
            firstName: firstName,
            lastName: surname
        });
    }

    checkStatus(): void {
        this.setState({
            user: this.service.getUser(),
            completedProfile: this.service.completedProfile(),
            firstName: this.service.getUser()?.first_name ?? null,
            lastName: (() => {
                const user = this.service.getUser();
                return user ? user.last_name : null;
            })(),
        });
    }
    clearStatus(): void {
        this.setState({
            user: null,
            completedProfile: false,
            firstName: null,
            lastName: null,
        });
    }
}
