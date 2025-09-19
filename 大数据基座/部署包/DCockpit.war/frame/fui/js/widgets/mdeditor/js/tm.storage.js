/**
 * 本地存储
 * localStorage
 */

(function(win) {
	'use strict';

	// var LOCAL_STORAGE_NAME = mdConfig.localStorageName || 'MdDataBase@';  //本地数据localStorage键名

	var Storage = function(name) {
		this.LOCAL_STORAGE_NAME = name || 'MdDataBase@';
		this._db = null;	//内存中的文库缓存
		this.syncLocalStorage('read');
	};
	
	//同步本地存储中的内容
	Storage.prototype.syncLocalStorage = function(type) {
		if(type == 'read') {
			var defaultStr = '{"books":{}}';
			this._db = JSON.parse(win.localStorage[this.LOCAL_STORAGE_NAME] || defaultStr);

		} else if( type == "save") {
			win.localStorage[this.LOCAL_STORAGE_NAME] = JSON.stringify(this._db);
		}
	};

	/**
	 * [saveArticle 新增文章]
	 * @param {[type]} opt [description]
	 *   {
	 * 		bookId: 文库ID
	 *   	articleId: 文章ID
	 *    	content: 文章内容
	 *     	name: 文章标题
	 *      updateTime: 更新时间
	 *   }
	 */
	Storage.prototype.saveArticle = function(opt) {
		if(!!opt && typeof opt == 'object') {
			var _bookId = opt.bookId,
				_articleId = opt.articleId,
				_content = opt.content,
				_name = opt.name || '',
				_updateTime = opt.updateTime || '',
				_versionId = opt.versionId || '',
				_lastEditor = opt.lastEditor || '';

			if(!this._db.books[_bookId]) {
				this._db.books[_bookId] = {};
			}
			
			this._db.books[_bookId][_articleId] = {
				bookId: _bookId,
				articleId: _articleId,
				name: _name,
				updateTime: _updateTime,
				content: _content,
				versionId: _versionId,
				lastEditor: _lastEditor
			}

			this.syncLocalStorage('save');
		}
	};


	/**
	 * [removeArticle 删除文章]
	 * @param  {[type]} bookId    [description]
	 * @param  {[type]} articleId [description]
	 * @return {[type]}           [description]
	 */
	Storage.prototype.removeArticle = function(bookId,articleId) {
		if(bookId && articleId) {
			if(this._db.books[bookId]) {
				delete this._db.books[bookId][articleId];
				this.syncLocalStorage('save');
			}
		} else {
			console.log('bookId：'+bookId + "--->articleId:"+articleId+'--->不存在')
			return 0;
		}
	};

	/**
	 * [deleteVersion 删除文章版本信息]
	 * @param  {[type]} bookId    [description]
	 * @param  {[type]} articleId [description]
	 * @return {[type]}           [description]
	 */
	Storage.prototype.deleteVersion = function(bookId,articleId) {
		if(bookId && articleId) {
			if(this._db.books[bookId]) {
				if(this._db.books[bookId][articleId]) {
					delete this._db.books[bookId][articleId].versionId;
					this.syncLocalStorage('save');
				}
			}
		} else {
			console.log('bookId：'+bookId + "--->articleId:"+articleId+'--->不存在')
			return 0;
		}
	}

	/**
	 * [UpdateVersion 更新文章最后编辑时间]
	 * @param  {[type]} bookId    [description]
	 * @param  {[type]} articleId [description]
	 * @param  {[type]} updateTime [description]
	 * @return {[type]}           [description]
	 */
	Storage.prototype.updateLastTime = function(bookId,articleId,updateTime) {
		if(bookId && articleId) {
			if(this._db.books[bookId]) {
				if(this._db.books[bookId][articleId]) {
					this._db.books[bookId][articleId].updateTime = updateTime;
					this.syncLocalStorage('save');
				}
			}
		} else {
			console.log('bookId：'+bookId + "--->articleId:"+articleId+'--->不存在')
			return 0;
		}
	}

	/**
	 * [UpdateVersion 更新文章最后编辑人]
	 * @param  {[type]} bookId    [description]
	 * @param  {[type]} articleId [description]
	 * @param  {[type]} updateTime [description]
	 * @return {[type]}           [description]
	 */
	Storage.prototype.updateLastEditor = function(bookId,articleId,lastEditor) {
		if(bookId && articleId) {
			if(this._db.books[bookId]) {
				if(this._db.books[bookId][articleId]) {
					this._db.books[bookId][articleId].lastEditor = lastEditor;
					this.syncLocalStorage('save');
				}
			}
		} else {
			console.log('bookId：'+bookId + "--->articleId:"+articleId+'--->不存在')
			return 0;
		}
	}

	/**
	 * [UpdateName 更新文章标题]
	 * @param  {[type]} bookId    [description]
	 * @param  {[type]} articleId [description]
	 * @param  {[type]} versionId [description]
	 * @return {[type]}           [description]
	 */
	Storage.prototype.updateName = function(bookId,articleId,name) {
		if(bookId && articleId) {
			if(this._db.books[bookId]) {
				if(this._db.books[bookId][articleId]) {
					this._db.books[bookId][articleId].name = name;
					this.syncLocalStorage('save');
				}
			}
		} else {
			console.log('bookId：'+bookId + "--->articleId:"+articleId+'--->不存在')
			return 0;
		}
	}

	/**
	 * [editor 编辑更新文章]
	 * @param  {[type]} bookId     [description]
	 * @param  {[type]} articleId  [description]
	 * @param  {[String]} newContent [内容，可以为空]
	 * @return {[type]}            [description]
	 */
	Storage.prototype.editArticle = function(bookId,articleId,newContent) {

		if(bookId && articleId) {
			if(this._db.books[bookId]) {
				if(this._db.books[bookId][articleId]) {
					if(typeof newContent == "string") {
						this._db.books[bookId][articleId].content = newContent;
						this.syncLocalStorage('save');
					}else {
						throw new Error('Error, newContent must be a string!')
					}
				}
			}
		} else {
			console.log('bookId：'+bookId + "--->articleId:"+articleId+'--->不存在')
			return 0;
		}
	}

	//读取文章
	Storage.prototype.readArticle = function(bookId,articleId){
		if(bookId && articleId) {
			if(this._db.books[bookId]) {
				if(this._db.books[bookId][articleId]) {
					return this._db.books[bookId][articleId]
				} else {
					return 0;
				}
			} else {
				return 0;
			}
		} else {
			console.log('bookId：'+bookId + "--->articleId:"+articleId+'--->不存在')
			return 0;
		}
	}
	
	return win.TmStorage = Storage;
})(window);
