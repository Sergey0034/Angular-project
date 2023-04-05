# Angular-project
Проект на Angular 15. Используется готовый backend для работы, frontend - приложение разрабатывалось мною в учебных целях.
Приложение разделено на несколько модулей и есть общий (shared) модуль. Для запросов на бэкенд используется auth сервис, перехватчик запросов interceptor, который
добавляет в каждый запрос x-auth или access-token и route-guard canActivated для блокировки доступа к разделу неавторизованным пользователям.
В проекте реализована авторизация, регистрация и блог с возможностью комментировать статьи (для зарегистрированных пользователей). 
Для полей ввода на странице авторизации, регистрации и в модальном окне "Заявка на услугу"(Открывается при нажатии на кнопку подробнее на карточке услуги и 
при нажатии на кнопку в футере "перезвоните мне") реализована валидация.
При авторизации и регистрации пользователь попадает на главную страницу. На главной странице есть слайдер с акциями, блок с карточками услуг, блок с популярными статьями
полученными с бэкенда, в конктактах подключена яндекс-карта.
В хедере находится меню, клик по пунктам меню: 
"Услуги", "О нас", "Отзывы", "Контакты" - делает плавный скролл к блоку на главной странице.
А клик по пункту "Статьи" ведет на страницу блога, на которой отображаются карточки статьи получаемые с бэкенда. На странице блога реализована фильтрация карточек по 
категориям, используется ActivatedRoute для отслеживания query-параметров и при изменении - отправляется запрос на бэкенд для получения нужных карточек. Так же категории 
фильтра отображаются в плашках над каталогом, их можно удалить из списка. Под каталогом используется пагинация страниц, если карточек > 8 шт..
При клике на кнопку "Читать дальше" в карточке статьи - пользователь переходит на детальную страницу статьи, где отображаются комментарии с бэкенда, которые видит любой 
пользователь и может поставить лайк, дизлайк и отправить жалобу(при клике отправляется запрос на бэкенд, при загрузке страницы учитывается голос пользователя, жалоба
отправляется только один раз на комментарий). Оставить комментарий может только зарегистрированный пользователь. При нажатии на кнопку "Загрузить еще комментарии" 
отправляется запрос на бэкенд и отображаются по 10 следующих комментариев при каждом запросе.
Благодарю за ознакомление с моим проектом и выделенное на это время! Это очень ценно для меня!
