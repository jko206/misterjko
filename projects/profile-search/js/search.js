/* global $ */
$(document).ready(function(){
  DataCenter.init();
  SearchManager.init();
  ResultsPageManager.init();
  
  $('.toggle-switch').click(function(){
    $('.search-filter').toggleClass('folded');
  });
  $('.search-btn').click(function(){
    SearchManager.search();
  });
  $('.drop-down-wrap').click(function(){
    $('.drop-down-menu').toggleClass('hide');
  });
  window.onpopstate = function(){
    SearchManager.loadURL();
  };
});

const ENV_VARS = {
  RESPONSE_DELAY_TIME : 3000, // milliseconds
  RESPONSE_FAIL_RATE : 0.0, // to stimulate server failure or something
  PROFILES_PER_PAGE : 10,
  XHR_REQUEST_URL_MOCK: 'https://private-5f60f-toptalui.apiary-mock.com/developers',
  XHR_REQUEST_URL_PROD: 'http://toptalui.apiblueprint.org/developers',
};

const DataCenter = {
  data : {
    devCollection: undefined,
    /*
    devCollection: [
      {
        "id": 1,
        "first_name": "Willabella",
        "last_name": "Batten",
        "city": "Sampacho",
        "country": "Argentina",
        "category": "Full-stack developer",
        "skills": [
          {
            "title": "React"
          },
          {
            "title": "PHP"
          }
        ],
        "generalBio": "Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",
        "bio": "Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.\n\nMaecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.\n\nCurabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.\n\nInteger tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.\n\nPraesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.",
        "photoUrl": "http://dummyimage.com/100x100.jpg/cc0000/ffffff"
      },
      {
        "id": 2,
        "first_name": "Cecil",
        "last_name": "Walling",
        "city": "Geneng",
        "country": "Indonesia",
        "category": "Full-stack developer",
        "skills": [
          {
            "title": "Angular"
          },
          {
            "title": "PHP"
          }
        ],
        "generalBio": "Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",
        "bio": "In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.\n\nSuspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.\n\nMaecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.\n\nCurabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.\n\nInteger tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.",
        "photoUrl": "http://dummyimage.com/100x100.bmp/cc0000/ffffff"
      },
      {
        "id": 3,
        "first_name": "Maria",
        "last_name": "Brocking",
        "city": "Uppsala",
        "country": "Sweden",
        "category": "Backend developer",
        "skills": [
          {
            "title": "Java"
          },
          {
            "title": "PHP"
          }
        ],
        "generalBio": "Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.",
        "bio": "Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.\n\nAenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.\n\nCurabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.\n\nPhasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.\n\nProin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.",
        "photoUrl": "http://dummyimage.com/100x100.png/ff4444/ffffff"
      },
      {
        "id": 4,
        "first_name": "Barty",
        "last_name": "Iacobini",
        "city": "Walakeri",
        "country": "Indonesia",
        "category": "Frontend developer",
        "skills": [
          {
            "title": "Angular"
          },
          {
            "title": "React"
          }
        ],
        "generalBio": "Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.",
        "bio": "Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.\n\nPellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.\n\nCum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.\n\nEtiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.\n\nPraesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio.",
        "photoUrl": "http://dummyimage.com/100x100.jpg/cc0000/ffffff"
      },
      {
        "id": 5,
        "first_name": "Hadley",
        "last_name": "Balam",
        "city": "Beihe",
        "country": "China",
        "category": "Full-stack developer",
        "skills": [
          {
            "title": "React"
          },
          {
            "title": "Java"
          }
        ],
        "generalBio": "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
        "bio": "Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.\n\nPhasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.\n\nProin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.\n\nDuis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.\n\nDonec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.",
        "photoUrl": "http://dummyimage.com/100x100.png/ff4444/ffffff"
      },
      {
        "id": 6,
        "first_name": "Phyllis",
        "last_name": "McGerraghty",
        "city": "Mačkovec",
        "country": "Croatia",
        "category": "Full-stack developer",
        "skills": [
          {
            "title": "React"
          },
          {
            "title": "Ruby"
          }
        ],
        "generalBio": "In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.",
        "bio": "Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.\n\nProin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.\n\nDuis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.\n\nDonec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.\n\nDuis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.",
        "photoUrl": "http://dummyimage.com/100x100.bmp/ff4444/ffffff"
      },
      {
        "id": 7,
        "first_name": "Dionisio",
        "last_name": "Schaffel",
        "city": "’Unābah",
        "country": "Afghanistan",
        "category": "Full-stack developer",
        "skills": [
          {
            "title": "React"
          }
        ],
        "generalBio": "Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.",
        "bio": "Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.\n\nIn quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.\n\nMaecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.\n\nMaecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.\n\nNullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.",
        "photoUrl": "http://dummyimage.com/100x100.png/cc0000/ffffff"
      },
      {
        "id": 8,
        "first_name": "Chandal",
        "last_name": "Goodman",
        "city": "Chengqiao",
        "country": "China",
        "category": "Data scientist",
        "skills": [
          {
            "title": "Python"
          }
        ],
        "generalBio": "Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.",
        "bio": "Vestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.\n\nDuis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus.\n\nMauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.\n\nNullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.\n\nIn quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.",
        "photoUrl": "http://dummyimage.com/100x100.jpg/dddddd/000000"
      },
      {
        "id": 9,
        "first_name": "Quintilla",
        "last_name": "Jerrim",
        "city": "Kivijärvi",
        "country": "Finland",
        "category": "Full-stack developer",
        "skills": [
          {
            "title": "React"
          },
          {
            "title": "Python"
          }
        ],
        "generalBio": "Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.",
        "bio": "Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.\n\nCum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.\n\nEtiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.\n\nPraesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio.\n\nCras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
        "photoUrl": "http://dummyimage.com/100x100.jpg/ff4444/ffffff"
      },
      {
        "id": 10,
        "first_name": "James",
        "last_name": "Mushett",
        "city": "Świecie",
        "country": "Poland",
        "category": "Backend developer",
        "skills": [
          {
            "title": "Java"
          }
        ],
        "generalBio": "Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.",
        "bio": "Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.\n\nCum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.\n\nEtiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.\n\nPraesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio.\n\nCras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
        "photoUrl": "http://dummyimage.com/100x100.jpg/dddddd/000000"
      },
      {
        "id": 11,
        "first_name": "Lissi",
        "last_name": "O'Lennane",
        "city": "Novohrad-Volyns’kyy",
        "country": "Ukraine",
        "category": "Data scientist",
        "skills": [
          {
            "title": "Python"
          },
          {
            "title": "Go"
          }
        ],
        "generalBio": "Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.",
        "bio": "In congue. Etiam justo. Etiam pretium iaculis justo.\n\nIn hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.\n\nNulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.\n\nCras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.\n\nQuisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.",
        "photoUrl": "http://dummyimage.com/100x100.jpg/ff4444/ffffff"
      },
      {
        "id": 12,
        "first_name": "Pamelina",
        "last_name": "Adelman",
        "city": "Jarigue",
        "country": "Philippines",
        "category": "Mobile developer",
        "skills": [
          {
            "title": "iOS"
          },
          {
            "title": "React"
          }
        ],
        "generalBio": "Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.",
        "bio": "In congue. Etiam justo. Etiam pretium iaculis justo.\n\nIn hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.\n\nNulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.\n\nCras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.\n\nQuisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.",
        "photoUrl": "http://dummyimage.com/100x100.bmp/ff4444/ffffff"
      },
      {
        "id": 13,
        "first_name": "Stevana",
        "last_name": "Eastbrook",
        "city": "Niquinohomo",
        "country": "Nicaragua",
        "category": "Frontend developer",
        "skills": [
          {
            "title": "React"
          }
        ],
        "generalBio": "Sed ante. Vivamus tortor. Duis mattis egestas metus.",
        "bio": "Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.\n\nProin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.\n\nDuis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.\n\nDonec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.\n\nDuis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.",
        "photoUrl": "http://dummyimage.com/100x100.png/ff4444/ffffff"
      },
      {
        "id": 14,
        "first_name": "Burty",
        "last_name": "Dutson",
        "city": "Yilkiqi",
        "country": "China",
        "category": "Frontend developer",
        "skills": [
          {
            "title": "React"
          }
        ],
        "generalBio": "Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.",
        "bio": "Sed ante. Vivamus tortor. Duis mattis egestas metus.\n\nAenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.\n\nQuisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.\n\nVestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.\n\nIn congue. Etiam justo. Etiam pretium iaculis justo.",
        "photoUrl": "http://dummyimage.com/100x100.png/dddddd/000000"
      },
      {
        "id": 15,
        "first_name": "Leigha",
        "last_name": "Inmett",
        "city": "Sangat",
        "country": "Philippines",
        "category": "Full-stack developer",
        "skills": [
          {
            "title": "Angular"
          },
          {
            "title": "Ruby"
          }
        ],
        "generalBio": "Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.",
        "bio": "Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.\n\nPellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.\n\nCum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.\n\nEtiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.\n\nPraesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio.",
        "photoUrl": "http://dummyimage.com/100x100.png/dddddd/000000"
      },
      {
        "id": 16,
        "first_name": "Phebe",
        "last_name": "Rosenbloom",
        "city": "Tiegai",
        "country": "China",
        "category": "Frontend developer",
        "skills": [
          {
            "title": "Angular"
          },
          {
            "title": "React"
          }
        ],
        "generalBio": "Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.",
        "bio": "In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.\n\nNulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.\n\nCras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.\n\nQuisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.\n\nPhasellus in felis. Donec semper sapien a libero. Nam dui.",
        "photoUrl": "http://dummyimage.com/100x100.jpg/ff4444/ffffff"
      },
      {
        "id": 17,
        "first_name": "Tanney",
        "last_name": "Bernardinelli",
        "city": "Piedade",
        "country": "Brazil",
        "category": "Frontend developer",
        "skills": [
          {
            "title": "React"
          },
          {
            "title": "Angular"
          }
        ],
        "generalBio": "Duis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus.",
        "bio": "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.\n\nEtiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.\n\nPraesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio.\n\nCras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.\n\nProin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.",
        "photoUrl": "http://dummyimage.com/100x100.bmp/ff4444/ffffff"
      },
      {
        "id": 18,
        "first_name": "Monica",
        "last_name": "Blankman",
        "city": "Bordeaux",
        "country": "France",
        "category": "Full-stack developer",
        "skills": [
          {
            "title": "React"
          }
        ],
        "generalBio": "Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.",
        "bio": "In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.\n\nSuspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.\n\nMaecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.\n\nCurabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.\n\nInteger tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.",
        "photoUrl": "http://dummyimage.com/100x100.png/5fa2dd/ffffff"
      },
      {
        "id": 19,
        "first_name": "Cristal",
        "last_name": "Francke",
        "city": "Hengfeng",
        "country": "China",
        "category": "Full-stack developer",
        "skills": [
          {
            "title": "Angular"
          }
        ],
        "generalBio": "Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.",
        "bio": "Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.\n\nCras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.\n\nQuisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.\n\nPhasellus in felis. Donec semper sapien a libero. Nam dui.\n\nProin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.",
        "photoUrl": "http://dummyimage.com/100x100.bmp/5fa2dd/ffffff"
      },
      {
        "id": 20,
        "first_name": "Martie",
        "last_name": "Smylie",
        "city": "Yaroslavl",
        "country": "Russia",
        "category": "Full-stack developer",
        "skills": [
          {
            "title": "React"
          },
          {
            "title": "PHP"
          }
        ],
        "generalBio": "Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.",
        "bio": "Phasellus in felis. Donec semper sapien a libero. Nam dui.\n\nProin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.\n\nInteger ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.\n\nNam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.\n\nCurabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.",
        "photoUrl": "http://dummyimage.com/100x100.png/cc0000/ffffff"
      },
      {
        "id": 21,
        "first_name": "Agace",
        "last_name": "Andras",
        "city": "Palama",
        "country": "Indonesia",
        "category": "Data scientist",
        "skills": [
          {
            "title": "Go"
          },
          {
            "title": "PHP"
          }
        ],
        "generalBio": "Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.",
        "bio": "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.\n\nEtiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.\n\nPraesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio.\n\nCras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.\n\nProin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.",
        "photoUrl": "http://dummyimage.com/100x100.bmp/5fa2dd/ffffff"
      },
      {
        "id": 22,
        "first_name": "Oralia",
        "last_name": "Waddington",
        "city": "Cincinnati",
        "country": "United States",
        "category": "Full-stack developer",
        "skills": [
          {
            "title": "React"
          },
          {
            "title": "Java"
          }
        ],
        "generalBio": "In congue. Etiam justo. Etiam pretium iaculis justo.",
        "bio": "In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.\n\nNulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.\n\nCras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.\n\nQuisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.\n\nPhasellus in felis. Donec semper sapien a libero. Nam dui.",
        "photoUrl": "http://dummyimage.com/100x100.jpg/dddddd/000000"
      },
      {
        "id": 23,
        "first_name": "Livvy",
        "last_name": "Reveley",
        "city": "Zuwārah",
        "country": "Libya",
        "category": "Backend developer",
        "skills": [
          {
            "title": "Java"
          },
          {
            "title": "Go"
          }
        ],
        "generalBio": "Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.",
        "bio": "Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.\n\nAenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.\n\nCurabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.\n\nPhasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.\n\nProin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.",
        "photoUrl": "http://dummyimage.com/100x100.png/dddddd/000000"
      },
      {
        "id": 24,
        "first_name": "Pren",
        "last_name": "Todarello",
        "city": "Dorūd",
        "country": "Iran",
        "category": "Backend developer",
        "skills": [
          {
            "title": "PHP"
          }
        ],
        "generalBio": "Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",
        "bio": "Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.\n\nProin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.\n\nDuis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.\n\nDonec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.\n\nDuis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.",
        "photoUrl": "http://dummyimage.com/100x100.bmp/ff4444/ffffff"
      },
      {
        "id": 25,
        "first_name": "Leesa",
        "last_name": "Crean",
        "city": "Malabugas",
        "country": "Philippines",
        "category": "Frontend developer",
        "skills": [
          {
            "title": "React"
          }
        ],
        "generalBio": "Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.",
        "bio": "Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.\n\nSed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.\n\nPellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.\n\nCum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.\n\nEtiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.",
        "photoUrl": "http://dummyimage.com/100x100.jpg/dddddd/000000"
      },
      {
        "id": 26,
        "first_name": "Inge",
        "last_name": "Mc Giffin",
        "city": "Gbadolite",
        "country": "Democratic Republic of the Congo",
        "category": "Full-stack developer",
        "skills": [
          {
            "title": "Angular"
          }
        ],
        "generalBio": "Phasellus in felis. Donec semper sapien a libero. Nam dui.",
        "bio": "Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.\n\nPraesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio.\n\nCras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.\n\nProin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.\n\nAenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.",
        "photoUrl": "http://dummyimage.com/100x100.png/cc0000/ffffff"
      },
      {
        "id": 27,
        "first_name": "Mariana",
        "last_name": "Scurrell",
        "city": "Mahīn",
        "country": "Syria",
        "category": "Full-stack developer",
        "skills": [
          {
            "title": "React"
          }
        ],
        "generalBio": "Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.",
        "bio": "Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.\n\nCurabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.\n\nInteger tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.\n\nPraesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.\n\nMorbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.",
        "photoUrl": "http://dummyimage.com/100x100.png/ff4444/ffffff"
      },
      {
        "id": 28,
        "first_name": "Salvatore",
        "last_name": "Wilkinson",
        "city": "Alajuela",
        "country": "Costa Rica",
        "category": "Full-stack developer",
        "skills": [
          {
            "title": "React"
          }
        ],
        "generalBio": "Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.",
        "bio": "Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.\n\nProin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.\n\nDuis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.\n\nDonec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.\n\nDuis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.",
        "photoUrl": "http://dummyimage.com/100x100.bmp/5fa2dd/ffffff"
      },
      {
        "id": 29,
        "first_name": "Davidson",
        "last_name": "Tindall",
        "city": "Timbrangan",
        "country": "Indonesia",
        "category": "Frontend developer",
        "skills": [
          {
            "title": "Angular"
          }
        ],
        "generalBio": "Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.",
        "bio": "Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.\n\nDonec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.\n\nDuis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.\n\nIn sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.\n\nSuspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.",
        "photoUrl": "http://dummyimage.com/100x100.jpg/5fa2dd/ffffff"
      },
      {
        "id": 30,
        "first_name": "Martha",
        "last_name": "Skett",
        "city": "Nangaroro",
        "country": "Indonesia",
        "category": "Full-stack developer",
        "skills": [
          {
            "title": "Angular"
          },
          {
            "title": "React"
          }
        ],
        "generalBio": "Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.",
        "bio": "Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.\n\nSed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.\n\nPellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.\n\nCum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.\n\nEtiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.",
        "photoUrl": "http://dummyimage.com/100x100.png/cc0000/ffffff"
      }
    ],
    */
    skillsCollection: [
      {
        "id": 1,
        "title": "Android"
      },
      {
        "id": 2,
        "title": "iOS"
      },
      {
        "id": 3,
        "title": "Java"
      },
      {
        "id": 4,
        "title": "Python"
      },
      {
        "id": 5,
        "title": "PHP"
      },
      {
        "id": 6,
        "title": "Angular"
      },
      {
        "id": 7,
        "title": "React"
      },
      {
        "id": 8,
        "title": "Ruby"
      },
      {
        "id": 9,
        "title": "Go"
      }
    ],
    specializationCollection: [
      {
        "id": 1,
        "title": "Full-stack developer"
      },
      {
        "id": 2,
        "title": "Backend developer"
      },
      {
        "id": 3,
        "title": "Mobile developer"
      },
      {
        "id": 4,
        "title": "Data scientist"
      },
      {
        "id": 5,
        "title": "Frontend developer"
      }
    ],
  },
  init(){
    var request = new XMLHttpRequest();

    request.open('GET', ENV_VARS.XHR_REQUEST_URL_MOCK, true);
    let thisObj = this;
    request.onreadystatechange = function () {
      if (this.readyState === 4) {
        // console.log('Status:', this.status);
        // console.log('Headers:', this.getAllResponseHeaders());
        // console.log('Body:', this.responseText);
        thisObj.data.devCollection = JSON.parse(this.responseText);
      }
    };
    
    request.send();
  },
  getSpecs(){
    return this.data.specializationCollection;
  },
  getSkills(){
    return this.data.skillsCollection;
  },
  getProfiles(query){
    /*
      query = {
        
        location : ""
        skills : ["Angular", "React"],
        spec : : "Frontend developer"
      }
      sampleProfile = {
        "id": 30,
        "first_name": "Martha",
        "last_name": "Skett",
        "city": "Nangaroro",
        "country": "Indonesia",
        "category": "Full-stack developer",
        "skills": [
          {
            "title": "Angular"
          },
          {
            "title": "React"
          }
        ],
        "generalBio": "Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.",
        "bio": "Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.\n\nSed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.\n\nPellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.\n\nCum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.\n\nEtiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.",
        "photoUrl": "http://dummyimage.com/100x100.png/cc0000/ffffff"
      }
    */
    let {spec, skills, location} = query;
    if(!(spec || skills.length || location)) return [];
    
    // convert skills to set from array
    skills = (_=>{
      let s = new Set();
      skills.forEach(e=>s.add(e));
      return s;
    })();
    // get initial dev pool
    let devPool = this.data.devCollection;
    let devs = devPool;
    if(!devs.length) return [];
    devs.forEach(dev=>{
      dev.score = 0;
    });
    
    // filter by right specialization
    if(spec){
      devs = devs.filter(dev=>{
        let {category, score} = dev;
        if(category === spec) score++;
        dev.score = score;
        return score;
      });
    }
    if(!devs.length) devs = devPool;
    
    let temp = devs; 
    // filter by right skills
    if(skills.size){
      devs = devs.filter(dev=>{
        let devSkills = dev.skills;
        let score = 0;
        devSkills.forEach(skill=>{
          let devSkill = skill.title;
          if(skills.has(devSkill)) score++;
        });
        if(score){
          dev.score += score;
          return score;
        }
      });
    }
    if(!devs.length) devs = temp;
    
    // filter by location
    temp = devs;
    if(location){
      let [inputLoc1, inputLoc2] = location.toLowerCase().split(/\,\s?/);
      devs = devs.filter(dev=>{
        let {city, country} = dev;
        if(city) city = city.toLowerCase();
        if(country) country = country.toLowerCase();
        let score = 0;
        
        // both city and country match;
        let case1 = (inputLoc1 === city && inputLoc2 === country)
          || (inputLoc2 === city && inputLoc1 === country);
        
        // city XOR country matches
        let case2 = (inputLoc1 === country)
          || (inputLoc1 === city)
          || (inputLoc2 === country)
          || (inputLoc2 === city);
        if(case1){
          score += 2;
        } else if(case2) {
          score++;
        }
        dev.score += score;
        return score;
      });
    }
    if(!devs.length) devs = temp;
    // sort by score
    
    devs.sort((d1, d2)=>{
      // from highest to lowest score
      return d2.score - d1.score;
    });
    
    return devs;    
    
  },
  getProfile(id){
    let list = this.data.devCollection;
    for(let i = 0; i < list.length; i++){
      let item = list[i];
      if(item.id == id) return item;
    }
    throw new Error('profile not found');
  }
};

const SearchManager = {
  state : {
    skills : new Set(),
    spec : '',
    specID : '',
    location: '',
    lastSearch: '',
    resultsCount: '',
    getState(){
      // return JSON of current state;
      let obj = this;
      return {
        skills : [...obj.skills],
        spec: obj.spec,
        specID: obj.specID,
        location: obj.location,
      };
    },
  },
  init(){
    // get specs / skills, render them, attach events
    let specs = DataCenter.getSpecs();
    let dropDownItemTemplate = (title, id)=> (
      `<div class="item" id="dropdown-item-${id}">
        ${title}
      </div>`
    );
    let radioItemTemplate = (title, id)=> (
      `<li>
        <input type="radio" id="dev-${id}" name="dev-type">
        <label for="dev-${id}">${title}</label>
      </li>`
    );
    specs.forEach(spec=>{
      let {title, id} = spec;
      // create UI
      let dropDownItem = dropDownItemTemplate(title, id);
      $(dropDownItem).click(function(){
        SearchManager.changeSpec(title, id);
      }).appendTo('header .drop-down-menu');
      
      
      let radioItem = radioItemTemplate(title, id);
      $(radioItem).click(function(e){
        e.preventDefault();
        SearchManager.changeSpec(title, id);
      }).appendTo('.filter-dev-type ul');
    });
    
    let skillsItemTemplate = title=>{
      let lowerCaseTitle = title.toLowerCase();
      return `<li>
        <input id="skill-${lowerCaseTitle}" type="checkbox">
        <label for="skill-${lowerCaseTitle}">${title}</label>
      </li>`;
    }
    let skills = DataCenter.getSkills();
    skills.forEach(skill=>{
      let {title, id} = skill;
      // create UI
      let checkboxItem = skillsItemTemplate(title);
      let thisObj = this;
      $(checkboxItem).click(function(e){
        e.preventDefault();
        thisObj.toggleSkills(title);
      }).appendTo('.filter-skills ul');
    });
    
    this.loadURL();
    
    // Load the pseudo cards for ENV_VARS.PROFILES_PER_PAGE
    let $container = $('.loading-msg');
    let template = (
      `<div class="card">
        <div class="card-pic">
          <img src="https://dummyimage.com/100x100.jpg/f0f0f0/000000" alt="profile picture">
        </div>
        <div class="card-detail">
          <div class="pseudo-line"></div>
          <div class="pseudo-line"></div>
          <div class="pseudo-line"></div>
          <div class="pseudo-line"></div>
          <div class="pseudo-line"></div>
        </div>
        <button class="card-btn" disabled>
          View profile
        </button>
      </div>`
    );
    for(let i = 0; i < ENV_VARS.PROFILES_PER_PAGE; i++){
      $container.append(template);
    }
    let thisObj = this;
    $('.search-bar input[type="text"]').keyup(function(e){
      if(e.which === 13){
        // user pressed enter
        $('.search-btn').click();
      } else {
        let input = $(this).val();
        thisObj.changeLocation(input);
      }
    });
  },
  changeSpec(spec, specID){
    // this change can be done from either drop down or the checkboxes
    // update view: make sure both the drop down and radios are selected correctly
    
    // Change the display in search bar
    if(this.state.spec == spec || spec === '--RESET--'){
      $('.drop-down-display').text(`Choose Specialization`);
      
      $('.drop-down-menu .selected').removeClass('selected');
      
      $(`.filter-dev-type input[type="radio"]`).attr('checked', false);
      
      this.state.spec = '';
      this.state.specID = '';
    } else {
      $('.drop-down-display').text(`${spec} in`);
      
      // select dropdown menu item in search bar
      $('.drop-down-menu .selected').removeClass('selected');
      $(`#dropdown-item-${specID}`).addClass('selected');
      
      // check the box in filter
      $(`#dev-${specID}`).attr('checked', true);
      
      this.state.spec = spec;
      this.state.specID = specID;
    }
  },
  changeLocation(location){
    this.state.location = location;
  },
  toggleSkills(skill, replace){
    // if a skill is already selected, deselect, and vice versa
    let skills;
    if(replace){
      this.state.skills = skill;
      skills = skill;
    } else {
      skills = this.state.skills;
      if(skills.has(skill)){
        skills.delete(skill);
      } else {
        skills.add(skill);
      }
    }
    
    $('.filter-skills input[checked]').attr('checked', false);
    skills.forEach(skill=>{
      let id = `#skill-${skill.toLowerCase()}`;
      $(id).attr('checked', true);
    });
  },
  
  search(changeURL = true){
    function displaySearchResultsTitle(isEmpty){
      let querySummaryTitle;
      if(isEmpty){
        querySummaryTitle = '';
      } else {
        // Display what the search is about
        let title = SearchManager.state.spec;
        let location = SearchManager.state.location;
        querySummaryTitle = (_=>{
          let str = 'Top ';
          str += title ? `${title.toLowerCase()}s ` : 'talents ';
          if(location) str += `in ${location}`;
          return str;
        })();
      }
      $('.search-results-title').text(querySummaryTitle);
    }
    MessageUI.showLoadingScreen();
    
    $('.search-result-pages').empty();
    let query = this.state.getState();
    if(changeURL) this.updateURL();
    let promise = new Promise((resolve, reject)=>{
      setTimeout(_=>{
        let r = Math.random();
        if(r >= ENV_VARS.RESPONSE_FAIL_RATE){
          let profiles = DataCenter.getProfiles(query);
          resolve(profiles);
        } else {
          reject('Unknown Error');
        }
      }, ENV_VARS.RESPONSE_DELAY_TIME);
    });
    let state = this.state;
    promise.then(function(data){
      MessageUI.hideMessage();
      if(data && data.length){
        state.resultsCount = data.length;
        ResultsPageManager.reset();
        ResultsPageManager.loadProfiles(data);
        displaySearchResultsTitle();
        $('.search-pages').removeClass('hide');
      } else {
        displaySearchResultsTitle(true);
        MessageUI.showNoResults();
        $('.search-pages').addClass('hide');
      }
    }).catch(function(e){
      MessageUI.showError(e);
      displaySearchResultsTitle(true);
      $('.search-pages').addClass('hide');
    });
  },
  loadURL(){
    // If the url has any params, then load them
    const urlParams = (function(){
      // parse URL and return the args
      let params = window.location.search;
      if(!params) return;
      params = params
        .substr(1)  // gets rid of '?' in the beginning
        .replace('%20', ' ')
        .split('&');
      let obj = {};
      params.forEach((elem)=>{
        let [key, value] = elem.split('=');
        if(key === 'skills') value = value.split(',');
        else if(key === 'specID') value = (value >> 0);
        obj[key] = value;
      });
      return obj;
    }());
    if(urlParams){
      let {skills, spec, specID, location} = urlParams;
      let doSearch = (skills && skills.length) || spec || location;
      if(skills){
        let s = new Set();
        skills.forEach(skill=>{
          s.add(skill);
        });
        this.toggleSkills(s, true);
      } else {
        this.toggleSkills(new Set(), true);
      }
      if(spec){
        this.changeSpec(spec, specID);
      } else {
        this.changeSpec('--RESET--');
      }
      this.changeLocation(location);
      
      if(doSearch) this.search(false);
    }    
  },
  updateURL(){
    let {skills, spec, specID, location} = this.state.getState();
    
    skills = skills.length ? `?skills=${skills.join(',')}` : '';
    spec = spec ? skills ? `&spec=${spec}` : `?spec=${spec}` : '';
    spec += spec ? `&specID=${specID}`: '';
    location = location ? spec ? `&location=${location}` : `?location=${location}` : '';
    let params = skills + spec + location;
    
    let {pathname} = window.location;
    let isSearchPage = pathname.match('search.html');
    if(isSearchPage){
      window.history.pushState({},'', params);
    } else {
      window.location.href = `search.html${params}`;
    }
    
  },
};

const MessageUI = {
  showLoadingScreen(){
    this.hideMessage();
    $('.loading-msg').show();
  },
  showError(e){
    this.hideMessage();
    $('.error-msg').text(e).show();
  },
  showNoResults(){
    this.hideMessage();
    $('.no-results').show();
  },
  hideMessage(){
    $('.search-ui-msg').hide();
  },
};

const ResultsPageManager = {
  // page is 0-based (first page is page 0);
  currPage: -1,
  lastPage: 0, // the very last page
  maxPage: -1,  // the farthest the user has viewed
  pageDivs: [],
  pageNumDivs: [],
  init(){
    let thisObj = this;
    $('.prev-btn').click(function(){
      thisObj.prevPage();
    });
    $('.next-btn, .show-more').click(function(){
      thisObj.nextPage();
    });
    $('.search-results').on('click', '.card-btn', function(){
      let id = $(this).data('id');
      window.location.href = `profile.html?id=${id}`;
    });
  },
  reset(){
    $('.search-result-pages').empty();
    $('.page-nums').empty();
    
    this.currPage = -1
    this.lastPage = 0;
    this.maxPage = -1;
    this.pageDivs = [];
    this.pageNumDivs = [];
  },
  loadProfiles(profiles){
    function makePages(profiles){
      let profPages = [];
      let profPageDiv = '<div class="search-result-page"></div>';
      let $profPageDiv = $(profPageDiv);
      let profCount = 0;
      let profCardTemplate = profile=>{
        let {
          id,
          first_name,
          last_name,
          skills,
          generalBio,
          photoUrl,
        } = profile;
        let name = `${first_name} ${last_name}`;
        skills = skills.map(e=>e.title);
        photoUrl = photoUrl.replace('http:', 'https:');
        let skillStr = skills.join(' / ');
        return (
          `<div class="card">
            <div class="card-pic">
              <img src="${photoUrl}" alt="${name}'s profile picture">
            </div>
            <div class="card-detail">
              <div class="card-detail-name">${name}</div>
              <div class="card-detail-title">${skillStr} expert</div>
              <div class="card-detail-desc">
                ${generalBio}
              </div>
            </div>
            <button class="card-btn" data-id="${id}">
              View profile
            </button>
          </div>`
        );
      };
      profiles.forEach(profile=>{
        let profCard = profCardTemplate(profile);
        $profPageDiv.append(profCard);
        
        profCount++;
        if(profCount == ENV_VARS.PROFILES_PER_PAGE){
          profCount = 0;
          profPages.push($profPageDiv);
          $profPageDiv = $(profPageDiv);
        }
      });
      if($profPageDiv.children().length){
        profPages.push($profPageDiv);
      }
      return profPages;
    }
    function appendPages(pages){
      pages.forEach((page, pageNum)=>{
        // create Page
        $('.search-result-pages').append(page);
      });
    }
    function makePageNav(pageCount, thisObj){
      let pageNums = [];
      for(let pageNum = 0; pageNum < pageCount; pageNum++){
        let $div = $(`<div>${pageNum + 1}</div>`);
        $div.click(function(){
          thisObj.gotoPage(pageNum);
        });
        pageNums.push($div);
      }
      return pageNums
    }
    function appendPageNav(pageNums){
      let $parent = $('.page-nums');
      pageNums.forEach($pn=>{
        $pn.appendTo($parent);
      });
    }
    
    let profPages = makePages(profiles);
    this.pageDivs = profPages;
    appendPages(profPages);
    
    let pageCount = profPages.length;
    this.lastPage = pageCount - 1;
    let pageNums = makePageNav(pageCount, this);
    this.pageNumDivs = pageNums;
    appendPageNav(pageNums);
    
    this.gotoPage(0);
  },
  prevPage(){
    this.gotoPage(this.currPage - 1);
  },
  nextPage(){
    this.gotoPage(this.currPage + 1);
  },
  gotoPage(p){
    // show/hide page nav buttons
    function displayPageNavBtns(p, thisObj){
      if(p === 0) $('.prev-btn').hide();
      else $('.prev-btn').show();
      
      if(p === thisObj.lastPage) $('.next-btn').hide();
      else $('.next-btn').show();
    }
    function displayPages(thisObj){
      for(let i = 0; i <= p; i++){
        let div = thisObj.pageDivs[i]
        $(div).addClass('show-for-mobile');
      }
      
      // show/hide pages
      $('.search-result-pages .show').removeClass('show');
      let page = thisObj.pageDivs[p];
      $(page).addClass('show');
    }
    function displayShowMoreBtn(maxPage, lastPage){
      let $showMoreBtn = $('.show-more');
      if(maxPage === lastPage){
        $showMoreBtn.addClass('hide');
      } else {
        let loadCount = ENV_VARS.PROFILES_PER_PAGE;
        let profCount = SearchManager.state.resultsCount; // total profiles 
        let currCount = loadCount * (p + 1); // number of profiles currently visible
        let remainingCount = profCount - currCount;
        let text;
        if(remainingCount <= loadCount){
          text = `Load ${remainingCount}`;
        } else {
          text = `Load ${loadCount} (of ${remainingCount})`;
        }
        
        $showMoreBtn
          .text(text)
          .removeClass('hide');
        
      }
    }
    function displayPageNums(thisObj){
      function pageNumsToShow(currPage, lastPage){
        let firstPageNum, lastPageNum;
        if(lastPage < 7){
          firstPageNum = 0;
          lastPageNum = lastPage;
        } else if(currPage < 3){
          firstPageNum = 0;
          lastPageNum = 6;
        } else if(lastPage - currPage < 3){
          firstPageNum = lastPage - 6;
          lastPageNum = lastPage;
        } else {
          firstPageNum = currPage - 3;
          lastPageNum = currPage + 3;
        }
        return {firstPageNum, lastPageNum};
      }
      // show/hide page nums
      let {currPage, lastPage} = thisObj;
      let {firstPageNum, lastPageNum} = pageNumsToShow(currPage, lastPage);
      $('.page-nums div').each(function(i){
          if(i >= firstPageNum && i <= lastPageNum){
            $(this).removeClass('hide');
          } else {
            $(this).addClass('hide');
          }
        });
      $('.page-nums .active').removeClass('active');
      let pageNum = thisObj.pageNumDivs[p];
      $(pageNum).addClass('active');
    }
    
    if(p !== this.currPage && p >= 0 && p <= this.lastPage){
      if(p > this.maxPage) this.maxPage = p;
      this.currPage = p;
      displayPageNavBtns(p, this);
      displayPages(this);
      displayShowMoreBtn(this.maxPage, this.lastPage);
      displayPageNums(this);
    }
    
  },
};