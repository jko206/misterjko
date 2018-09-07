/* global $ */



//for people, only return set number of people at a time or something
const getData = function(type, devSpecs){
  const data = {
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
  };
  let res = data[type];
  if(!res){
    throw new Error('Data does not exist or something.');
  }
  
  if(devSpecs){
    /*
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
    */
    let {specialization, skills, location} = devSpecs;
    if(!(specialization || (skills && skills.length) || location)) return [];
    // get initial dev pool
    let devs = res; 
    if(!devs.length) return [];
    
    // filter by right specialization
    if(specialization){
      specialization = (function(){
        // convert ID to string (e.g. '1' => 'Full-stack developer');
        let specs = data['specializationCollection'];
        for(let i = 0; i < specs.length; i++){
          let {id, title} = specs[i];
          if(id == specialization){
            return title;
          }
        }
      }());
      devs = devs.filter(dev=>{
        let {category, score} = dev;
        score = score || 0;
        if(category === specialization) score++;
        dev.score = score;
        return score;
      });
    }
    
    if(!devs.length) devs = res;
    
    let temp = devs; 
    // filter by right skills
    if(skills && skills.length){
      let wantedSkills = (function(){
        // convert IDs to strings (e.g. "1" => "Android")
        let skillID2Title = {};
        let skillsCollection = data['skillsCollection'];
        skillsCollection.forEach(({id, title})=>{
          skillID2Title[id] = title;
        });
        let s = new Set();
        skills.forEach(skillID=>{
          let skill = skillID2Title[skillID];
          s.add(skill);
        });
        return s;
      }());
      // console.log(wantedSkills);
      devs = devs.filter(dev=>{
        let devSkills = dev.skills;
        let score = 0;
        for(let i = 0; i < devSkills.length; i++){
          let skill = devSkills[i].title;
          if(wantedSkills.has(skill)) score++;
        }
        if(score){
          let currScore = dev.score || 0;
          dev.score = currScore + score;
          return score;
        }
      });
    }
    if(!devs.length) devs = temp;
    
    // filter by location
    temp = devs;
    if(location){
      let [inputLoc1, inputLoc2] = location.toLowerCase().split(/\,\s?/);
      devs = res.filter(dev=>{
        let {city, country, score} = dev;
        if(city) city = city.toLowerCase();
        if(country) country = country.toLowerCase();
        score = score || 0;
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
        dev.score = score;
        return score;
      });
    }
    if(!devs.length) devs = temp;
    // sort by score
    devs.specialization = specialization;
    devs.sort((d1, d2)=>{
      return d2.score - d1.score;
    });
    
    return devs;
  } else {
    return res;
  }
}

/*
Possible route for optimization:

const updateResults = (function(){
  function findDiff(arr1, arr2){
    let diff;
    if(diff){
      
      return {
        element: '',
        isAdd: false,
      }
    } else {
      return false;
    }
  }
  function updateSkills(){
    
  }
  function updateSpecialzation(spec){
    // remove curr spec from search results
    // put in new specs
    // render
  }
  function render(){
    
  }
  let id2skill = {};
  let currSkills = [];
  let currSpecializations = '';
  
  // from arr1 to arr2
  return function (selected){
    let {skills, specialization} = selected;
    let isSkillsDiff = findDiff(skills, currSkills);
    let isSpecDiff = specialization !== currSpecializations;
    
    if(isSkillsDiff && isSpecDiff){
      
    } else if(isSkillsDiff){
      
    } else if(isSpecDiff){
      updateSpecialzation(specialization);
    } else {
      // don't do anything
    }
  }
}());
*/

const pageManager = (function(){
  let currPage, lastPage, maxPage, pages, devCount;
  
  
  function displayPageNavBtns(pageNum){
    if(lastPage === 1){
      $('.prev-btn, .next-btn').hide();
    } else if(pageNum === 1){
      $('.prev-btn').hide()
      $('.next-btn').show();
    } else if(pageNum === lastPage){
      $('.prev-btn').show()
      $('.next-btn').hide();
    } else {
      $('.prev-btn').show()
      $('.next-btn').show();
    }
  }
  function displayPage(pageNum){
    // for big screen view
    // for mobile view
    let temp = n=>`#page-${n}`;
    for(let i = 1; i <= pageNum; i++){
      let id = temp(i)
      $(id).addClass('show-for-mobile');
      // console.log(id);
    }
    $('.show').removeClass('show');
    $(temp(pageNum)).addClass('show');
  }
  function displayPageNum(pageNum){
    // 1-based index
    // get 4 neighbors n such that n <= max
    // for showing page numbers at the bottom
    function getNeighbors(base, max){
      let neighbors = [];
      if(max <= 5){
        while(max){
          if(max !== base){
            neighbors.unshift(max);
          }
          max--;
        }
      } else if(max - base < 2){
        let back = max;
        while(back > base){
          neighbors.push(back--);
        }
        let front = base - 1;
        while(neighbors.length < 4){
          neighbors.unshift(front--);
        }
      } else {
        return [
          base - 2,
          base - 1,
          base + 1,
          base + 2,
        ];
      }
      return neighbors;
    }
    // show appropriate pagenum
    // toggle / untoggle .active for appropriate page num
    // for the "show more" button as well
    
    let id = n=>`#page-num-${n}`;
    $('.page-nums .active').removeClass('active');
    $(id(pageNum)).addClass('active');
    let neighbors = getNeighbors(pageNum, lastPage);
  }
  
  return {
    reset(){
      // state
      currPage = undefined;
      lastPage = undefined;
      maxPage = -1;
      pages = undefined;
      
      // view
      $('.page-nums').empty();
      $('.search-result-cards').remove();
      $('.no-results').show();
    },
    initPages(p, dc){
      // set max pages
      if(dc){
        this.showMessage('hide');
        $('.search-pages').removeClass('hide');
        pages = p; 
        lastPage = p.length;
        maxPage = -1;
        devCount = dc;
        
        let template = n=>`<div class="page-num" id="page-num-${n}">${n}</div>`;
        for(let i = 1; i <= lastPage; i++){
          let div = template(i);
          let $div = $(div);
          let cb = this.showPage;
          $div.click(function(){
            cb(i);
          });
          $('.page-nums').append($div);
        }
      } else {
        $('.search-pages').addClass('hide');
        this.showMessage('no-result');
      }
    },
    showMessage(type, err){
      if(type === 'hide'){
        $('.search-ui-msgs').hide();
      } else {
        $('.search-ui-msgs').show();
        if(type === 'load'){
          $('.loading-msg').show();
        } else if(type === 'no-result'){
          $('.no-results').show();
        } else if(type === 'error'){
          $('.error-msg').text(err).show();
        }
        
      }
    },
    showPage(pageNum){
      currPage = pageNum;
      if(currPage > maxPage){
        maxPage = currPage;
        let remaining = devCount - (maxPage * 10);
        if(remaining > 0){
          $('.show-more').removeClass('hide');
          let msg;
          if(remaining < 10){
            msg = `Show ${remaining} more`;
          } else {
            msg = `Show 10 more (of ${remaining})`;
          }
          $('.show-more').text(msg);
        } else{
          $('.show-more').addClass('hide')
        }
      }
      
      displayPageNavBtns(pageNum);
      displayPageNum(pageNum);
      displayPage(pageNum);
    },
    error(e){
      console.log('an error happened.');
      // show error message to the UI
    },
    nextPage(){
      this.showPage(currPage + 1);
    },
    prevPage(){
      this.showPage(currPage - 1);
    },
  }
}());

const updateResults = (function(){
  function render(data, extra){
    function getPages(cards){
      let pages = [];
      let pageTemplate = (`
        <div class="search-result-cards"></div>
      `).replace(/\n+/g, '');
      let $page = $(pageTemplate);
      let id = n=>`page-${n}`;
      let pageNum = 1;
      let cardCount = 0;
      
      // $page.addClass(`search-result-${pageCount}`)
      $page.attr('id', id(pageNum));
      
      while(cards.length){
        cardCount++;
        let card = cards.shift();
        $page.append(card);
        if(cardCount === 10){
          cardCount = 0; 
          pageNum++;
          pages.push($page);
          // $page = $(pageTemplate).addClass(`search-result-${pageCount}`);
          $page = $(pageTemplate).attr('id', id(pageNum));
        }
      }
      pages.push($page);
      return pages;
    }
    
    /* sameple dev: 
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
    */
    let {specialization, location} = extra;
    
    if(location) location = 'in ' + location;
    let talent = (specialization || 'talent').toLowerCase();
    let title = `Top ${talent}s ${location}`;
    $('.search-results-title').text(title);
    let cards = data.map(dev=>{
      let {
        id, 
        first_name, 
        last_name, 
        city,
        country,
        categry,
        skills, 
        category,
        generalBio,
        photoUrl,
      } = dev;
      // console.log(first_name, last_name, category, skills);
      let fullName = `${first_name} ${last_name}`;
      let skillsStr = skills.map(({title})=>{
        return title;
      }).join(' / ');
      photoUrl = photoUrl.replace('http://', 'https://');
      
      let template = (
`<div class="card">
  <div class="card-pic">
    <img src="${photoUrl}" alt="${fullName}'s profile picture">
  </div>
  <div class="card-detail">
    <div class="card-detail-name">${fullName}</div>
    <div class="card-detail-title">${skillsStr} expert</div>
    <div class="card-detail-desc">
      ${generalBio}
    </div>
  </div>
  <button class="card-btn">
    View profile
  </button>
</div>`
      );
      
      let $temp = $(template);
      $temp.click(function(){
        window.location.href = (`./profile.html?id=${id}`);
      });
      return $temp;
    });
    let devCount = cards.length;
    let pages = getPages(cards);
    
    pageManager.reset();
    pages.forEach(page=>{
      $('.search-results').append(page);
    });
    pageManager.initPages(pages, devCount);
    pageManager.showPage(1);
  }
  
  
  return {
    update(selected){
      try{
        let {location} = selected;
        let data = getData('devCollection', selected);
        let {specialization} = data;
        render(data, {specialization, location});
      } catch(e){
        pageManager.error(e);
      }
      
    }
  }
}());

$(document).ready(function(){
  // load and render specializations and skills
  (function(){
    // load the skills and specializations
    let skills = getData('skillsCollection');
    let target = $('.filter-skills ul');
    skills.forEach(skill=>{
      let {id, title} = skill;
      let str = `
        <li>
          <input id="skill-${id}" type="checkbox" value="${id}">
          <label for="skill-${id}">${title}</label>
        </li>
      `;
      target.append(str);
    });
    
    let specializations = getData('specializationCollection');
    target = $('.filter-dev-type ul');
    specializations.forEach(spec=>{
      let {id, title} = spec;
      let str = `
        <li>
          <input name="dev" id="dev-${id}" type="radio" value="${id}">
          <label for="dev-${id}">${title}</label>
        </li>
      `;
      target.append(str);
      
    });
    
    // load people with specified specialties, and make pages accordingly
    // let searchResultsCount = getData('');
    
    // load everyone with the given title and location
    
  }());
  $('.fold-toggle-wrap').click(function(){
    $('.search-filter').toggleClass('folded');
  });
  
  let selected = {
    specialization: undefined,
    skills: [],
  };
  $('.search-filter input').change(function(){
    let $this = $(this);
    let isSpecialization = $this.attr('id').match(/^dev\-/);
    let val = $this.val();
    let isChecked = $this.is(':checked');
    
    if(isSpecialization){
      selected.specialization = val;
    } else {
      let arr = selected.skills;
      if(isChecked){
        arr.push(val);
      } else {
        // console.log('uncheck: ' + val);
        // remove the val from arr
        let elemFound = false;
        for(let i = 0; i < arr.length; i++){
          let elem = arr[i];
          if(elem === val) elemFound = true;
          if(elemFound) arr[i] = arr[i+1];
        }
        arr.pop();
      }
    }
    let location = $('#search-location').val();
    selected.location = location;

    updateResults.update(selected);
  });
  
  $('.search-bar input[type="text"]').keydown(function(e){
    let key = e.which;
    let val = $(this).val();
    if(key === 13 && val !== undefined){
      $('.search-btn').click();
    }
  });
  
  $('.drop-down-menu .item').click(function(){
    let $this = $(this);
    $this.siblings().removeClass('selected');
    $this.addClass('selected');
    
    let val = $this.text();
    val += ' in';
    $('.drop-down-display').text(val);
    
  });
  
  $('.search-btn').click(function(){
    let location = $('#search-location').val();
    updateResults.update({location});
  });
  
  $('.next-btn, .show-more').click(function(){
    pageManager.nextPage();
  });
  
  $('.prev-btn').click(function(){
    pageManager.prevPage();
  });
  
  
});
