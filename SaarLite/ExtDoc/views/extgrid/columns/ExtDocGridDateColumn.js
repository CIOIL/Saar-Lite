Ext.define('ExtDoc.views.extgrid.columns.ExtDocGridDateColumn',{
	requires: ['ExtDoc.views.extgrid.columns.ExtDocGridColumn'],	
	extend: 'ExtDoc.views.extgrid.columns.ExtDocGridColumn',
	listeners:{
		headerclick: function (ct, column, e, t, eOpts){
			var store = ct.grid.store;
			var ndirection = this.sortState;
			var sortClass = 'x-column-header-sort-';
			var dateFormat = 'd/m/Y H:i:s';
			var altDirection = ndirection == 'ASC' ? 'DESC':'ASC';
			Ext.suspendLayouts();
			
			store.sort([{sorterFn: function(record1, record2){
				var userVal1 = Ext.Date.parse(record1.get('r_modify_date'), dateFormat);
				var userVal2 = Ext.Date.parse(record2.get('r_modify_date'), dateFormat);
				
				if (userVal1 === userVal2)
				{
					return 0;
				}
					
				return userVal1 < userVal2 ? -1 : 1;
	        }, direction: ndirection}],'multi');
			
			var headerDom = undefined;
			
			try
			{
	           	headerDom = Ext.DomQuery.select('div[class*="' + sortClass + ndirection + '"]');
	           	headerDom[0].classList.remove(sortClass + ndirection);
	           	headerDom[0].classList.add(sortClass + this.sortState);
	        }
	        catch (error)
	        {
	        	
	        }
	        
	        if (headerDom[0]=== undefined)
	        {
	        	try
	            {
	   				headerDom = Ext.DomQuery.select('div[class*="' + sortClass + altDirection+'"]');
	         		headerDom[0].classList.remove(sortClass + altDirection);
	         		headerDom[0].classList.add(sortClass + ndirection);
	           	}  	
	         	catch (error)
	         	{
	         		
	         	}
	        }
	        
	        this.sortState = ndirection == 'ASC' ? 'DESC':'ASC';
	        Ext.resumeLayouts(true);
		}
	},
	renderer: function(value, metaData, record, row, col, store, gridView){
		if(!Ext.isEmpty(record.get('object_name')))
		{
			if (value && value != 'nulldate')
			{
				metaData.tdAttr = 'data-qtip="' + value + '"';
			}
		}
		
		return  value == 'nulldate' ? '' : value;
	}
});