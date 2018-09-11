'use strict';
/*global DataCenter $*/

$(function(){

  function formatData(data){
    let {
      first_name,
      last_name,
      category,
      city,
      country,
      skills,
      experience,
      bio,
      generalBio,
      photoUrl,
      help_with,
    } = data;
    skills = skills.map(e=>e.title);
    let fullName = `${first_name} ${last_name}`;
    let location = `${city}, ${country}`;
    photoUrl = photoUrl.replace('http:', 'https:');
    let title = `${skills.join(' / ')} expert, ${category.toLowerCase()}`;
    if(!help_with){
      help_with = skills.map(skill=>{
        if(skill !== 'iOS'){
          let firstLetter = skill[0].toUpperCase();
          skill = firstLetter + skill.substr(1);
        }
        return skill + ' development';
      });
    }
    let helpWithStr = help_with.join('</li><li>');
    helpWithStr = `<li>${helpWithStr}</li>`;
    let experienceDiv = '';
    if(experience){
      let gut = '';
      experience.forEach(item=>{
        let {
          title, 
          period,
          achievements,
          technologies,
        } = item;
        achievements = `<li>${achievements.join('</li><li>')}</li>`
        gut += (
          `<div>
            <h3>${title} (${period})</h3>
            <ul>
              ${achievements}
            </ul>
            Technologies: ${technologies}
          </div>`
        );
      });
      experienceDiv = (
        `<div class="profile-experience">
          <h2>Experience</h2>
          ${gut}
        </div>`
      );
    } 
    let bioDiv = '';
    if(bio){
      bio = bio.replace('\n\n', '</p><p>');
      bioDiv += (
        `<div class="profile-bio">
          <h2>Biography</h2>
          <p>
            ${bio}
          </p>
        </div>`
      );
    } 
    let template = (
      `<div class="profile-main">
        <h1>${fullName}</h1>
        <div class="title_location">
          <span class="title">${title}</span>
          <span class="location">
            <img src="images/drop-pin.png" alt="drop-pin">
            ${location}
          </span>
        </div>
        <div class="picture">
          <img src="${photoUrl}" alt="${fullName}'s picture">
        </div>
        <div class="summary">
          ${generalBio}
        </div>
      </div>
      <div class="profile-connect">
        <h4>Contact options</h4>
        <button id="connect">
          <img src="images/connect-64x64.png" alt="connect icon">
          Connect
        </button>
      </div>
      <div class="profile-skills">
        <h4>${first_name} can help you with:</h4>
        <ul>
          ${helpWithStr}
        </ul>
      </div>
      <div class="profile-history">
        ${experienceDiv}
        ${bioDiv}
        
      </div>`
    );
    
    ///////////
    $('.contact-name').text(fullName);
    ///////////
    
    return template;
    
  }
  let shouldLoadProfile = window.location.search.match(/id\=\d+/);
  let profileData;
  setTimeout(function(){
    if(shouldLoadProfile){
      let id = shouldLoadProfile[0].match(/\d+/)[0];
      id = parseInt(id, 10);
      $('.loading-screen').addClass('hide');
      try{
        profileData = DataCenter.getProfile(id);
      } catch(e){
        $('.profile-not-exist').removeClass('hide');
        return;
      }
    } else {
      // load default
      profileData = {
        "id": -1,
        "first_name": "George",
        "last_name": "Griffin",
        "city": "New York",
        "country": "United States",
        "category": "Full-stack developer",
        "skills": [
          {
            "title": "iOS"
          }
        ],
        "generalBio" : "George has over 15 years of experience as a full-stack developer, including creating a #1 iOS game in 2008 and scaling Yahoo! ad servers. George\'s strengths are adaptability, clear communication, and a relentless focus on the details that get projects shipped.",
        "photoUrl": "images/george_griffin.png",
        // "generalBio": "Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.",
        // "bio": "Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.\n\nSed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.\n\nPellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.\n\nCum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.\n\nEtiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.",
        "experience" : [
          {
            "title" : "CEO at MobilityDrive",
            "period" : "2009 - present",
            "achievements" : [
              "Developed iOS apps which has been installed on over 15 million devices and RocketScience app was #1 in the App Store in December 2007.",
              "Created other games including RPG TrueMasters",
              "Co-author of VisualMadness 360 for Global Retailers, enterprise iPad app that provides supermarkets with a way to direct store layouts and perform visual (photo-based) audits.",
              "Developed a social photo sharing platform/ that transcends language and location through video and photo conversations. Used Unique UX, localization, real-time translation, and web services."
            ],
            "technologies" : "iOS, C, C++, Objective-C, Parse.com, OpenGL, REST, Web Services, Cheetah3D"
          },
          {
            "title" : "Team Lead at MultiMedia LLC",
            "period" : "2004 - 2008",
            "achievements" : [
              "Developed technical integrations of Right Media Ad Server into the Yahoo! APT platform.",
              "Led numerous end-to-end APT feature implementations from design, development, and testing to production, depoyment and monitoring.",
              "Developed numerous internal-facing tools and web services for Yahoo! Sales and Engineering and Search marketing groups.",
              "Developed the Right Media back-end display advertising server system."
            ],
            "technologies" : "Perl, C++"
          },
          
        ],
        "help_with" : [
          "Mobile iOS development",
          "CTO management",
          "Python development",
          "C++ development",
          "Parse.com",
          "Swift",
          "REST API architecture",
        ]
      };
    }
    let template = formatData(profileData);
    $('#index-html').append(template);
  }, 3500);
});