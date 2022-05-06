 var db = openDatabase('Temp_inf', '1.0', 'Test DB', 2 * 1024 * 1024);
	   var msg;
	   var timeObj=window.localStorage.getItem("time",timeObj);
	   var tempObj=window.localStorage.getItem("temp",tempObj);
	   var dbKeyObj=window.localStorage.getItem("dbKey",dbKeyObj);
	   
	    var dbKeyObj_start=parseInt(dbKeyObj);
	   
	   console.log(typeof(dbKeyObj_start));
	   
	   if(dbKeyObj_start == 0){
		  db.transaction(function (tx) {
		     tx.executeSql('INSERT INTO LOGS (time_log, temp_log) VALUES ("'+timeObj+'","'+tempObj+'")'); 
		     // msg = '<p>数据表已创建，且插入了两条数据。</p>';
		     // console.log(msg);
			 setTimeout('function()',1000);
		  });   
	   }else{
		   ; 
	   }
	
	   db.transaction(function (tx) {
	        tx.executeSql('DELETE FROM LOGS where temp_log=""');
	        msg = '<p>删除</p>';
			console.log(msg);
	        // document.querySelector('#status').innerHTML =  msg;
	   });
	
	   db.transaction(function (tx) {
	       tx.executeSql('UPDATE LOGS SET log=\'runoob.com\' WHERE id=2');
	        msg = '<p>更新</p>';
			console.log(msg);
	        // document.querySelector('#status').innerHTML =  msg;
	   });
	
	   db.transaction(function (tx) {
	      tx.executeSql('SELECT * FROM LOGS', [], function (tx, results) {
	         var len = results.rows.length, i;
	         msg = "<p>查询记录条数: " + len + "</p>";
			 console.log(msg);
	         // document.querySelector('#status').innerHTML +=  msg;
	         
	         for (i = 0; i < len; i++){
	            msg = "<p><b>" + results.rows.item(i).log + "</b></p>";
				console.log(msg);
	            // document.querySelector('#status').innerHTML +=  msg;
	         }
	      }, null);
		  
		// function selectTemp(){
		// 	db.transaction(function (tx) {
		// 	   tx.executeSql('SELECT * FROM LOGS', [], function (tx, results) {
		// 	      var len = results.rows.length, i;
		// 	      msg = "<p>查询记录条数: " + len + "</p>";
		// 				 console.log(msg);
		// 	      // document.querySelector('#status').innerHTML +=  msg;
			      
		// 	      for (i = 0; i < len; i++){
		// 	         msg = "<p><b>" + results.rows.item(i).log + "</b></p>";
		// 					console.log(msg);
		// 	         // document.querySelector('#status').innerHTML +=  msg;
		// 	      }
		// 	   }, null);
		// }
		  
	   });