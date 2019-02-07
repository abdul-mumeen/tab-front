import { Component, OnInit } from '@angular/core';

import { SideNavModel } from './side-nav.model';

@Component({
    selector: 'app-main-side-nav',
    styleUrls: ['./side-nav.component.scss'],
    templateUrl: './side-nav.component.html',
})

export class SideNavComponent implements OnInit{

    private isProduction: boolean = false;
    private isFullView: boolean = false;

    constructor() {
    }

    ngOnInit(): void {
        this.setNavItems();
    }

    testToggle() {
        this.isFullView = !this.isFullView;
    }

    setNavItems() {
        if(this.isProduction) {
            this.navItems = this.filterForProd(this.navItems);
        }
    }

    filterForProd(nav: SideNavModel[]): SideNavModel[] {
        return nav.map(nav => {
            if(nav.children) nav.children = this.filterForProd(nav.children);
            return nav;
        }).filter(nav => {
            return nav.isProduction;
        });
    }

    private navItems: SideNavModel[] = [
        {
            name: 'Home',
            id: 'home',
            route: '/home',
            icon: 'home',
            isProduction: true,
        },
        {
            name: 'Finance',
            id: 'finance',
            isProduction: true,
            isOpen: true,
            children: [
                {
                    name: 'Billing Workflow',
                    id: 'billing',
                    isProduction: true,
                    children: [
                        {
                            name: 'Overview',
                            id: 'overview',
                            route: '/billing',
                            pageTitle: 'Billing Overview',
                        },
                        {
                            name: 'Set Billing Schedule',
                            id: 'schedule',
                            route: '/billing/schedule',
                        },
                        {
                            name: 'Fee Sync',
                            id: 'feesync',
                            route: '/billing/feesync',
                        },
                        {
                            name: 'Pre-Billing Audit',
                            id: 'preaudit',
                            route: '/billing/preaudit',
                            isProduction: true,
                        },
                        {
                            name: 'Post Invoices',
                            id: 'postinvoices',
                            route: '/billing/postinvoices',
                        },
                        {
                            name: 'Invoice Audit',
                            id: 'invoiceaudit',
                            route: '/billing/invoiceaudit',
                            isProduction: true,
                        },
                        {
                            name: 'Manual Import',
                            id: 'import',
                            route: '/billing/batch/upload',
                        },
                        {
                            name: 'Auto Import',
                            id: 'import',
                            route: '/billing/auto-batch',
                        },
                        {
                            name: 'Import Insurance Credits',
                            id: 'import',
                            route: '/billing/insurance',
                        },
                        {
                            name: 'AR-Audit',
                            id: 'araudit',
                            route: '/billing/araudit',
                            isProduction: true,
                        },
                        {
                            name: 'Post Payments',
                            id: 'postpayments',
                            route: '/billing/postpayments',
                        },
                    ],
                },
                {
                    name: 'Invoices & Payments',
                    id: 'invoice-payment',
                    isProduction: true,
                    children: [
                        {
                            name: 'Invoice Management',
                            id: 'invoicemanage',
                            route: '/management/invoice/summary',
                            isProduction: true,
                        },
                        {
                            name: 'Payment Management',
                            id: 'paymentmanage',
                            route: '/management/payment/summary',
                            isProduction: true,
                        },
                    ],
                },
            ],
        },
        {
            name: 'Legal',
            id: 'legal',
            isOpen: true,
            children: [
                {
                    name: 'FA Versions',
                    id: 'test',
                    children: [
                        {
                            name: 'FA Fee Management',
                            id: 'feemanagement',
                            route: '/legal/feemanagement'
                        },
                        {
                            name: 'FA Fees by Club',
                            id: 'feesbyclub',
                            route: '/legal/club-fees'
                        }
                    ]
                }
            ]
        },
        {
            name: 'Operations',
            id: 'operations',
            isProduction: false,
            isOpen: true,
            children: [
                {
                    name: 'Employees',
                    id: 'employees',
                    isProduction: false,
                    children: [
                        {
                            name: 'Reports',
                            id: 'reports',
                            route: '/employees/reports',
                            pageTitle: 'Reports',
                            isProduction: false,
                        }
                    ]
                }
            ]
        }
    ];
}

