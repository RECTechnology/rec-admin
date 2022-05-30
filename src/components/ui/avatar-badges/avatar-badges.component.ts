import { Component, Input } from "@angular/core";
import { Badge } from '../../../shared/entities/badge.ent';


@Component({
    selector: 'avatar-badges',
    styleUrls: ['./avatar-badges.scss'],
    templateUrl: './avatar-badges.html'
})

export class AvatarBadges {
    @Input() public badge: Badge;
    @Input() public size: number = 20;

    constructor(){
        
    }
}