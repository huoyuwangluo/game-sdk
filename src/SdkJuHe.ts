module platform {
	//--------------------------------------------------
	// 九翎聚合sdk
	//--------------------------------------------------
	export class SdkJuHe extends SdkBase {
		private _shareCallBack: Function;
		private _sharethisObject: any;
		public constructor() {
			super(JLJH);
			this._channleId = 10013;
			this._appId = "100031";//appid：100031  appkey：6a11b531ec8461cd64eee9ba6e1149d6
		}
		public getScripts(): string[] {
			return ["https://game.jiulingwan.com/public/sdk/js/sdk_cp.min.js"];
		}
		public start(): boolean {
			if ((window as any).AWY_SDK) {
				(window as any).AWY_SDK.config(this._appId, this.onShareSuccess);
				(window as any).AWY_SDK.config2(this.gamePauseCallback, this.gameStartCallback);
			}
			var params: any = getUrlParams();
			this._userId = this._roleId = params.username;
			this._time = params.logintime;
			this._token = params.token;
			if (params.iswxsubscribe == 0) {
				this._focus = false;
			} else {
				this._focus = true;
			}
			if (params.isShowBack == 1) {
				this.addButton();
			}
			this.end(params);
			return true;
		}
		private xlContainer: egret.DisplayObjectContainer;
		private startPoint: egret.Point;
		private touchPoint: egret.Point;
		private stage: egret.Stage;
		private addButton() {
			this.startPoint = new egret.Point();
			this.touchPoint = new egret.Point();
			this.xlContainer = new egret.DisplayObjectContainer();

			var moveIcon: egret.Bitmap = new egret.Bitmap();
			var moveContianer: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
			moveContianer.touchEnabled = true;
			this.xlContainer.addChild(moveContianer);
			moveContianer.addChild(moveIcon);
			moveContianer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.buttonTouchHandler, this);

			var returnContianer: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
			returnContianer.touchEnabled = true;
			var returnIcon: egret.Bitmap = new egret.Bitmap();
			this.xlContainer.addChild(returnContianer);
			returnContianer.addChild(returnIcon);
			returnIcon.x = 63;
			returnContianer.addEventListener(egret.TouchEvent.TOUCH_TAP, (e) => {
				(window as any).AWY_SDK.backHome();
			}, this);
			this.stage = (window as any).shell.layerManager.stage;
			(window as any).shell.layerManager.sdk.addChild(this.xlContainer);
			this.xlContainer.x = this.stage.stageWidth - (63 * 2) - 40;
			this.xlContainer.y = 50;
			RES.getResByUrl('resource/xldrag.png', (xldrag: egret.Texture) => {
				moveIcon.texture = xldrag;
				RES.getResByUrl('resource/xlretrun.png', (xlretrun: egret.Texture) => {
					returnIcon.texture = xlretrun;
				}, this);
			}, this);
		}

		private buttonTouchHandler(e: egret.TouchEvent) {
			switch (e.type) {
				case egret.TouchEvent.TOUCH_BEGIN:
					if (this.xlContainer.stage) {
						this.xlContainer.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.buttonTouchHandler, this);
						this.xlContainer.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.buttonTouchHandler, this);
						this.startPoint.setTo(this.xlContainer.x, this.xlContainer.y);
						this.touchPoint.setTo(e.stageX, e.stageY);
					}
					break;
				case egret.TouchEvent.TOUCH_MOVE:
					var tx = this.startPoint.x + (e.stageX - this.touchPoint.x);
					var ty = this.startPoint.y + (e.stageY - this.touchPoint.y);
					tx = Math.max(tx, 0);
					ty = Math.max(ty, 0);
					tx = Math.min(tx, this.stage.stageWidth - (63 * 2));
					ty = Math.min(ty, this.stage.stageHeight - 42);
					this.xlContainer.x = tx;
					this.xlContainer.y = ty;
					break;
				case egret.TouchEvent.TOUCH_END:
					if (this.xlContainer.stage) {
						this.xlContainer.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.buttonTouchHandler, this);
						this.xlContainer.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.buttonTouchHandler, this);
					}
					break;
			}
		}
		/** 游戏暂停函数 */
		private gamePauseCallback() { }
		/** 游戏开始函数 */
		private gameStartCallback() { }
		/** 显示关注二维码 */
		public showFocus(caller: any, method: Function) {
			if ((window as any).AWY_SDK) {
				(window as any).AWY_SDK.showQRCode();
			}
		}
		public mixLoadEnd() {
			if ((window as any).AWY_SDK) {
				(window as any).AWY_SDK.mixLoadEnd();
			}
		}
		public getDataType(type: string): number {
			switch (type) {
				//选择服务器
				case DATA_SELECT_SERVER: return 1;
				//创角成功
				case DATA_CREATE_ROLE: return 2;
				//进入游戏
				case DATA_ENTER_GAME: return 3;
				//角色升级
				case DATA_LEVEL_UP: return 4;
				//退出游戏
				case DATA_QUIT_GAME: return 5;
				//充值
				case DATA_PAY: return 6;
				//聊天
				case DATA_CHAT: return 7;
				//进入创角界面
				case DATA_CREATE_ROLE_ENTER: return 8;
				//点击创角按钮
				case DATA_CREATE_ROLE_CLICK: return 9;

			}
			return 0;
		}
		/**用户分享成功后，SDK会回调该方法。调用该方法时SDK会同时给该函数返回一个字符串“SUCCESS”（全部大写）表示用户是否已分享成功，其余情况均表示分享不成功或者用户取消分享。*/
		private onShareSuccess() {
			egret.log("分享成功");
			if (this._shareCallBack && this._sharethisObject) {
				this._shareCallBack.apply(this._sharethisObject);
			}
		}
		/**显示分享引导 */
		public showShare(caller: any, method: Function) {
			if ((window as any).AWY_SDK) {
				(window as any).AWY_SDK.showShare();
				this._shareCallBack = method;
				this._sharethisObject = caller;
			}
		}
		//上报数据
		public submitExtraData(
			dataType: number,
			appid: string,			//游戏appid
			serverId: number,
			serverName: string,		//区服名
			gameRoleUid: string,
			gameRoleName: string,		//角色名
			gameRoleLevel: number,		//角色等级
			diamonds: number,		//角色元宝数
			time: number,				//请求时间戳，精确到秒即可
			content: string,		//聊天内容
			chattype: string,		//聊天类型
			job: number,		//职业
			gameRoleVipLevel: number,		//游戏中玩家的vip等级
			zhuanshenLevel: number		//游戏中玩家的vip等级
		) {
			var dataName: string = this.getDataName(dataType);
			var obj = {};
			var leve = gameRoleLevel;
			if (zhuanshenLevel) {
				leve = (zhuanshenLevel * 1000 + gameRoleLevel);
			}
			switch (dataName) {
				case DATA_ENTER_GAME:
					if ((window as any).AWY_SDK) {
						(window as any).AWY_SDK.userinfo(leve, gameRoleName, serverName, this.userId, serverId, -1, 0);
					}
					break;
				case DATA_CREATE_ROLE:
					if ((window as any).AWY_SDK) {
						(window as any).AWY_SDK.userinfo(leve, gameRoleName, serverName, this.userId, serverId, 1, 0);
					}
					break;
				case DATA_LEVEL_UP:
					if ((window as any).AWY_SDK) {
						(window as any).AWY_SDK.userinfo(leve, gameRoleName, serverName, this.userId, serverId, -1, 0);
					}
					break;
			}
		}
		public openCharge(
			serverId: string, 				//玩家所在服务器的ID
			serverName: string, 				//玩家所在服务器的名称
			gameRoleId: string, 					//玩家角色ID
			gameRoleName: string, 				//玩家角色名称
			gameRoleLevel: string, 				//玩家角色等级
			gameRoleVip: string, 					//游戏中玩家的vip等级
			price: number, 					//充值金额(单位：分)
			diamonds: number, 				//玩家当前身上剩余的游戏币
			buyCount: number, 					//购买数量，一般都是
			productId: string, 				//充值商品ID，游戏内的商品ID
			productName: string, 			//商品名称，比如100元宝，500钻石...
			productDesc: string, 			//商品描述，比如 充值100元宝，赠送20元宝
			extension: number, 				//会在支付成功后原样通知到你们回调地址上，长度尽量控制在100以内
			time: number//请求时间戳，精确到秒即可
		) {
			var obj = {};
			obj['username'] = this.userId;
			obj['productname'] = productName;
			obj['amount'] = price;
			obj['roleid'] = this.userId;
			obj['serverid'] = serverId;
			obj['appid'] = this.userId;
			obj['token'] = this._token;
			var parameter = "username=" + this.userId + "&productname=" + productName + "&amount=" + price + "&roleid=" + this.userId + "&serverid=" + serverId + "&appid=" + this.appId + "&token=" + this.token + "&remarks=" + productId;
			this.juHePay(parameter);
		}
		private _mydom: HTMLDivElement;
		private _myWebView: HTMLIFrameElement;
		private _domWidth: number = 0.82;
		private _domHeight: number = 0.74;
		private _megin: number = 8;
		private juHePay(parameter) {
			var url = "//game.jiulingwan.com/sdk.php/User/Pay/subpage?";
			url = url + parameter;
			try {
				var mainDom = document.getElementById('main');
				if (!this._mydom) {
					this._myWebView = document.createElement("iframe");
					this._myWebView.id = 'page';
					this._myWebView.width = '100%';
					this._myWebView.height = '100%';
					this._myWebView.scrolling = 'auto';
					this._myWebView.style.border = "0px #000000 solid";
					this._myWebView.src = url;
					mainDom.appendChild(this._myWebView);
				}
				else {
					this._myWebView.src = url;
					mainDom.appendChild(this._myWebView);
				}
			} catch (e) {
				alert(e);
			}
		}
	}
}