"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OrgSvc = /** @class */ (function () {
    function OrgSvc(querySvc, user, org) {
        this.user = user;
        this.org = org;
        this.querySvc = querySvc;
        this.userOrgsData;
        this.userOrgRenderObjs;
        this.activeOrgRenderObj;
    }
    OrgSvc.prototype.canAddOrg = function (userOrgs) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            for (var i = 0; i < userOrgs.length; i++) {
                if (userOrgs[i].org_uuid === _this.org) {
                    console.log('already have');
                    var err = 'You have already added this org!';
                    reject(err);
                }
            }
            if (userOrgs.length >= 2) {
                console.log('only two orgrs');
                var err = 'You can only save 2 organizations to favorites right now.';
                reject(err);
            }
            console.log('you passed the test');
            resolve();
        });
    };
    OrgSvc.prototype.addToUserOrgs = function () {
        var _this = this;
        return this.querySvc.getUserOrgs([this.user.uuid])
            .then(function (userOrgs) { return _this.canAddOrg(userOrgs); })
            .then(function () { return _this.querySvc.insertUserOrg([_this.user.uuid, _this.org]); });
    };
    OrgSvc.prototype.formatRenderObj = function () {
        if (this.activeOrgRenderObj) {
            return {
                organizationContent: this.userOrgRenderObjs,
                email: this.user.email,
                name: this.activeOrgRenderObj.name,
                description: this.activeOrgRenderObj.description,
                cause: this.activeOrgRenderObj.cause,
                link: this.activeOrgRenderObj.link,
                defaultSet: this.activeOrgRenderObj.defaultSet,
                img: this.activeOrgRenderObj.img,
                uuid: this.activeOrgRenderObj.org_uuid
            };
        }
        else {
            return {
                organizationContent: this.userOrgRenderObjs,
                email: this.user.email
            };
        }
    };
    OrgSvc.prototype.userOrgRenderAdditions = function (orgs) {
        var renderVersion = [];
        for (var i = 0; i < orgs.length; i++) {
            renderVersion[i] = orgs[i];
            renderVersion[i].email = this.user.email;
            renderVersion[i].user_orgs = true;
            renderVersion[i].loggedIn = this.user.permission === 'user' ? true : false; // substitute for res.locals
        }
        return renderVersion;
    };
    OrgSvc.prototype.activeOrgRender = function (ActiveOrg) {
        return {
            defaultSet: true,
            active: true,
            name: ActiveOrg.name,
            description: ActiveOrg.description,
            link: ActiveOrg.link,
            cause: ActiveOrg.cause,
            img: ActiveOrg.img,
            org_uuid: ActiveOrg.org_uuid,
            org_sku: ActiveOrg.org_sku
        };
    };
    OrgSvc.prototype.activeOrgCheck = function (orgs) {
        for (var i = 0; i < orgs.length; i++) {
            if (orgs[i].active) {
                return this.activeOrgRender(orgs[i]);
            }
        }
    };
    OrgSvc.prototype.getUserOrgsAndActiveOrg = function () {
        var _this = this;
        return this.querySvc.getUserOrgsData([this.user.uuid])
            .then(function (orgs) {
            return {
                organizationContent: _this.userOrgRenderAdditions(orgs),
                activeOrgContent: _this.activeOrgCheck(orgs)
            };
        });
    };
    // separate out from can add?
    OrgSvc.prototype.alreadyAddedOrg = function (userOrgs) {
        for (var i = 0; i < userOrgs.length; i++) {
            if (userOrgs[i].org_uuid === this.org) {
                return true;
            }
        }
        return false;
    };
    // separate out from can add?
    OrgSvc.prototype.isActiveOrg = function (userOrgs) {
        for (var i = 0; i < userOrgs.length; i++) {
            if (userOrgs[i].org_uuid === this.org && userOrgs[i].active) {
                return true;
            }
        }
        return false;
    };
    OrgSvc.prototype.setDefaultOrg = function () {
        var _this = this;
        return this.querySvc.getUserOrgsData([this.user.uuid])
            .then(function (userOrgs) {
            if (_this.alreadyAddedOrg(userOrgs)) {
                console.log('org already added');
                if (_this.isActiveOrg(userOrgs)) {
                    var err = new Error('This org is already your default!');
                    throw err;
                }
                return false;
            }
            else {
                console.log('org not added, adding');
                return _this.querySvc.insertUserOrg([_this.user.uuid, _this.org]);
            }
        })
            .then(function () { return _this.querySvc.updateAllUserOrgsToFalse([false, _this.user.uuid]); })
            .then(function () { return _this.querySvc.updateActiveOrg([true, _this.user.uuid, _this.org]); });
    };
    OrgSvc.prototype.unsetDefaultOrg = function () {
        return this.querySvc.updateActiveOrg([false, this.user.uuid, this.org]);
    };
    OrgSvc.prototype.removeFromUserOrgs = function () {
        console.log('delete from user orgs', this.org, this);
        return this.querySvc.deleteFromUserOrgs([this.user.uuid, this.org]);
    };
    return OrgSvc;
}());
exports.default = OrgSvc;
//# sourceMappingURL=logic-organizations.js.map