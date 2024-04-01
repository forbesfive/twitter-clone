import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

// localStorage.clear()

function populateLocalStorage() {
    localStorage.setItem("tweetsLocalData", JSON.stringify(tweetsData))
}

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.replyBtn){
        handleReplyBtnClick(e.target.dataset.replyBtn)
    }
    else if(e.target.dataset.deleteBtn){
        handleDeleteBtnClick(e.target.dataset.deleteBtn)
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    populateLocalStorage()
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    populateLocalStorage()
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    
    localStorage.setItem("tweetsLocalData", JSON.stringify(tweetsData) )
    render()
    tweetInput.value = ''
    }
}

function handleDeleteBtnClick(tweetId){
    for (let i = 0; i < tweetsData.length; i++){
        if (tweetsData[i].uuid === tweetId){
            tweetsData.splice(i, 1)
        }
    }

    populateLocalStorage()
    render()
}

function handleReplyBtnClick(tweetId){
    if(document.getElementById(`reply-input-${tweetId}`).value){
        const targetTweetObj = tweetsData.filter(function(tweet){
            return tweet.uuid === tweetId
        })[0]

        targetTweetObj.replies.unshift(
        {
            handle: `@scrimba ✅`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: document.getElementById(`reply-input-${tweetId}`).value,
        })
        populateLocalStorage()
        render()
        handleReplyClick(tweetId)
    }
}

function getFeedHtml(){
    let feedHtml = ``
    let tweetsFromLocalStorage = JSON.parse(localStorage.getItem("tweetsLocalData"))
    
    if(tweetsFromLocalStorage === null){
        populateLocalStorage()
    }

    tweetsFromLocalStorage.forEach(function(tweet){
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = `
        <textarea placeholder="Reply here" class="reply-input" id="reply-input-${tweet.uuid}"></textarea>
        <button class="reply-btn" id="reply-btn-${tweet.uuid}" data-reply-btn="${tweet.uuid}">Reply</button>`
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                            </div>
                        </div>
                </div>
                `
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>        
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>
        <button class="delete-btn" id="delete-btn-${tweet.uuid}" data-delete-btn="${tweet.uuid}" title="Delete Message">X</button>  
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

