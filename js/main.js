var nums= new Array();
var score=0;
var hasConflicted=new Array();

$(document).ready(function(){
    newgame();

});
function newgame(){
    init();
    //随机生成上层单元格
    generateOneNumber();
    generateOneNumber();
}
function init(){
    //初始化单元格位置,下层单元格
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            var gridCell=$('#grid-cell-'+i+'-'+j);
            gridCell.css('top',getPosTop(i,j));
            gridCell.css('left',getPosLeft(i,j))
        }
    }
    //初始化数组
    for(var i=0;i<4;i++){
        nums[i]=new Array();
        hasConflicted[i]=new Array();
        for(var j=0;j<4;j++){
            nums[i][j]=0;
            hasConflicted[i][j]=false;
        }
    }

    updateView();
    score=0;
    upDateScore(score);

}
//更新上层单元格视图
function updateView(){
    //将上层单元格全部清空
    $('.number-cell').remove();
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            $('#grid-container').append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var numberCell=$('#number-cell-'+i+'-'+j);
            if(nums[i][j]==0){
                numberCell.css('width','0px');
                numberCell.css('height','0px');
                numberCell.css('top',getPosTop(i,j)+50);
                numberCell.css('left',getPosLeft(i,j)+50);

            }
            else{
                numberCell.css('width','100px');
                numberCell.css('height','100px');
                numberCell.css('top',getPosTop(i,j));
                numberCell.css('left',getPosLeft(i,j));
                numberCell.css('background-color',getNumberBackgroundColor(nums[i][j]));
                numberCell.css('color',getNumberColor(nums[i][j]));
                numberCell.text(nums[i][j]);
            }
            hasConflicted[i][j]=false;
        }
    }

}
//随机生成数字
//在随机空余的单元格中随机生成一个2或4

function generateOneNumber(){
    if(noSpace(nums)){
        return;
    }
    //随机一个位置
    var count=0;
    var temp=new Array();
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            if(nums[i][j]==0){
                temp[count]=i*4+j;
                count++;
            }
        }
    }
    var pos = Math.floor(Math.random()*count);
    var randx=Math.floor(temp[pos]/4);
    var randy=temp[pos]%4;
    var randNum= Math.random()<0.5 ?2:4;
    nums[randx][randy]=randNum;
    showNumberWithAnimation(randx,randy,randNum);
}
$(document).keydown(function(event){
    //左37上38右39下40
    event.preventDefault();
    switch(event.keyCode){
        case 37:
            //判断是否可以左移
            if(canMoveLeft(nums)){
                moveLeft();
                setTimeout(generateOneNumber,200);
                setTimeout('isGameOver()',500);
            }
            break;
        case 38:
            if(canMoveUp(nums)){
                moveUp();
                setTimeout(generateOneNumber,200);
                setTimeout('isGameOver()',500);
            }
            break;
        case 39:
            if(canMoveRight(nums)){
                moveRight();
                setTimeout(generateOneNumber,200);
                setTimeout('isGameOver()',500);
            }
            break;
        case 40:
            if(canMoveDown(nums)){
                moveDown();
                setTimeout(generateOneNumber,200);
                setTimeout('isGameOver()',500);
            }
            break;
        default:
            break;
    }
});
//向左移动
//需要对每一个数字左边进行判断，落脚点有两种情况
//落脚点没数字
//落脚点数字和自己相同
function moveLeft(){
	for(var i=0;i<4;i++){
		for(var j=1;j<4;j++){
			if(nums[i][j]!=0){
				for(var k=0;k<j;k++){
					if(nums[i][k]==0  && noBlockHorizontal(i,k,j,nums)){ //第i行的第k-j列之间是否有障碍物
						//移动操作
						showMoveAnimation(i,j,i,k);
						nums[i][k]=nums[i][j];
                        if(nums[i][k]==16){
                            alert('16了，真厉害，喊爸爸继续');
                        }
						nums[i][j]=0;
						break;
					}else if(nums[i][k]==nums[i][j] && noBlockHorizontal(i,k,j,nums) && !hasConflicted[i][k]){
						    showMoveAnimation(i,j,i,k);
                            nums[i][k]+=nums[i][j];
                            if(nums[i][k]==16){
                                alert('16了，真厉害，喊爸爸继续');
                            }
						    nums[i][j]=0;
						    //统计分数
						    score+=nums[i][k];
						    upDateScore(score);
                            hasConflicted[i][k]=true;
						    break;
                        }
				}
			}
		}
	}
	//更新页面上的数字单元格，此处才是真正的更新显示移动后的效果
	setTimeout('updateView()',200); //等待200ms，为了让单元格移动效果能够显示完
}
function moveRight(){
	for(var i=0;i<4;i++){
		for(var j=2;j>=0;j--){
			if(nums[i][j]!=0){
				for(var k=3;k>j;k--){
					if(nums[i][k]==0  && noBlockHorizontal(i,j,k,nums)){ //第i行的第k-j列之间是否有障碍物
						//移动操作
						showMoveAnimation(i,j,i,k);
						nums[i][k]=nums[i][j];
                        if(nums[i][k]==16){
                            alert('16了，真厉害，喊爸爸继续');
                        }
						nums[i][j]=0;
						break;
					}else if(nums[i][k]==nums[i][j] && noBlockHorizontal(i,j,k,nums) && !hasConflicted[i][k]){
						    showMoveAnimation(i,j,i,k);
                            nums[i][k]+=nums[i][j];
						    nums[i][j]=0;
                            if(nums[i][k]==16){
                                alert('16了，真厉害，喊爸爸继续');
                            }
						    //统计分数
						    score+=nums[i][k];
						    upDateScore(score);
                            hasConflicted[i][k]=true;
						    break;
                        }
				}
			}
		}
	}
	//更新页面上的数字单元格，此处才是真正的更新显示移动后的效果
	setTimeout('updateView()',200); //等待200ms，为了让单元格移动效果能够显示完
}
function moveUp(){
	for(var i=0;i<4;i++){
		for(var j=1;j<4;j++){
			if(nums[j][i]!=0){
				for(var k=0;k<j;k++){
					if(nums[k][i]==0  && noBlockVertical(i,k,j,nums)){ //第i行的第k-j列之间是否有障碍物
						//移动操作
						showMoveAnimation(j,i,k,i);
						nums[k][i]=nums[j][i];
						nums[j][i]=0;
                        if(nums[k][i]==16){
                            alert('16了，真厉害，喊爸爸继续');
                        }
						break;
					}else if(nums[k][i]==nums[j][i] && noBlockVertical(i,k,j,nums) && !hasConflicted[k][i]){
						    showMoveAnimation(j,i,k,i);
                            nums[k][i]+=nums[j][i];
						    nums[j][i]=0;
                            if(nums[k][i]==16){
                                alert('16了，真厉害，喊爸爸继续');
                            }
						    //统计分数
						    score+=nums[k][i];
						    upDateScore(score);
                            hasConflicted[k][i]=true;
						    break;
                        }
				}
			}
		}
	}
	//更新页面上的数字单元格，此处才是真正的更新显示移动后的效果
	setTimeout('updateView()',200); //等待200ms，为了让单元格移动效果能够显示完
}
function moveDown(){
	for(var i=0;i<4;i++){
		for(var j=2;j>=0;j--){
			if(nums[j][i]!=0){
				for(var k=3;k>j;k--){
					if(nums[k][i]==0  && noBlockVertical(i,j,k,nums)){ //第i行的第k-j列之间是否有障碍物
						//移动操作
						showMoveAnimation(j,i,k,i);
						nums[k][i]=nums[j][i];
						nums[j][i]=0;
                        if(nums[k][i]==16){
                            alert('16了，真厉害，喊爸爸继续');
                        }
						break;
					}else if(nums[k][i]==nums[j][i] && noBlockHorizontal(i,j,k,nums) && !hasConflicted[k][i]){
						    showMoveAnimation(j,i,k,i);
                            nums[k][i]+=nums[j][i];
						    nums[j][i]=0;
                            if(nums[k][i]==16){
                                alert('16了，真厉害，喊爸爸继续');
                            }
						    //统计分数
						    score+=nums[k][i];
						    upDateScore(score);
                            hasConflicted[k][i]=true;
						    break;
                        }
				}
			}
		}
	}
	//更新页面上的数字单元格，此处才是真正的更新显示移动后的效果
	setTimeout('updateView()',200); //等待200ms，为了让单元格移动效果能够显示完
}
function upDateScore(s){
    $('#score').text(s);
}
