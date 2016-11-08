//////////////////////////////////////////////////////////
//                     FRIENDS DATA
//////////////////////////////////////////////////////////

var FriendsData = {
    host: 'https://graph.facebook.com',
    version: 'v1.0',
    edge: 'me/friends',
    accessToken: 'CAACEdEose0cBAFofudhiLUcBf09lrnSFy3pKFiACaCr5zhBqBgNDZCqM4l9k2i8WzV6DzBZBi9vrYu16jeZCfLHSSjYFKqr2YnDSgm89BZCunSkkunfvNYRG1gOlKqZC0nYeTvBOkAKRsGB8jFL2ZBjcEByMtMbHlbv3kNmbGxq45JbJOEZA5kO6L7bByqydbr0b7R1c27T9CbkYGDisrbP'
};

FriendsData.getUrl = function() {
    return FriendsData.host + "/" +
        FriendsData.version + "/" +
        FriendsData.edge + "?access_token=" +
        FriendsData.accessToken;
};

FriendsData.parse = function(data) {
    var friends = [];
    data = JSON.parse(data);

    // For now, we just add the pictures
    // var entries = data.feed.entry;
    // for (var i = 0; i < entries.length; i++) {
    //     var media = entries[i].media$group;
    //     urls.push(media.media$content[0].url);
    // }

    return friends;
};

console.log(FriendsData.getUrl());

Utility.loadURL(FriendsData.getUrl(), initApp);

function initApp(data) {
    friends = FriendsData.parse(data);
}