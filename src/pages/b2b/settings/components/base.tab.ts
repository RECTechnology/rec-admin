export abstract class EntityTabBase {
    public query: string;
    public limit = 10;
    public offset = 0;

    public abstract search(): any;

    public ngOnInit() {
        this.search();
    }
}
