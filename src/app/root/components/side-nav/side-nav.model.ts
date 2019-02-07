export class SideNavModel {
    public name: string;
    public id: string;
    public icon?: string;
    public route?: string;
    public pageTitle?: string;
    public isProduction?: boolean;
    public isOpen?: boolean;

    public children?: SideNavModel[]
}