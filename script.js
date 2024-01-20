async function fetchRepos(){
    let currentPage = 1;
    const username = $('#username').val();
    const pages = $('#pages').val();
    const search = $('#search').val();
    const apiUrl = `https://api.github.com/users/${username}/repos?per_page=${pages}&page=${currentPage}&q=${search}`;


    $('#repos').empty();
    $('#loader').show();

    let res1 = await fetch(`https://api.github.com/users/${username}`);
    let userData = await res1.json();
    console.log(userData);

    let headers = {
                'Accept': 'application/vnd.github.v3+json',
                // 'x-ratelimit-limit': 100,
                // 'GITHUB_TOKEN': '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'
            }

    const res2 = await fetch(apiUrl,headers);
    let reposData = await res2.json();
    console.log(reposData);

    
    $('#loader').hide();
    displayRepos(reposData,userData);

}



function displayRepos(repositories,userData) {

    if (repositories.length === 0) {
        $('#repos').html(`<p class="text-info">No repositories found for the given user.</p>`);
        return;
    }

    const userDetails =
    $(`<img src=${userData.avatar_url}>
    <ul>
        <li><h2>${userData.name}</h2></li>
        <li>${userData.bio}</li>
        <li>${userData.location}</li>
        <li>${userData.twitter_username}</li>        
        <li>Link: <a href=${userData.html_url}>${userData.html_url}</a></li>
    </ul>`)

    if(userData.name != undefined){
        $('#profile').html(userDetails);
    }
    
    const repositoryList = $('<div class="card-container"></div>');
    repositories.forEach(async repo => {
        let res = await fetch(`https://api.github.com/repos/${userData.name}/${repo.name}/languages`);
        let languages = await res.json();
        console.log(languages);
        const listItem = 
        $(` <div class="card">
                <div class="card-header fa-weight">
                    ${repo.name}
                </div>
                <div class="card-body">
                    <h5 class="card-title"></h5>
                    <p class="card-text">${repo.description}</p>
                    <a href=${repo.html_url} class="btn btn-primary">Link</a>
                </div>
            </div>
        `);
        repositoryList.append(listItem);
    });

    $('#repos').append(repositoryList);
}