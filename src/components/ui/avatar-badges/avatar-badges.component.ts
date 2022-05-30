import { Component, Input } from "@angular/core";


@Component({
    selector: 'avatar-badges',
    styleUrls: ['./avatar-badges.scss'],
    templateUrl: './avatar-badges.html'
})

export class AvatarBadges {
    @Input() public badge: any;
    @Input() public size: number = 20;

    constructor(){
        
    }
}