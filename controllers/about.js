import { navList, logoInfo } from './common';

const page = 'about';

export const renderAbout = (req, res) => {
  res.render('about/index', {
    user: req.session.user,
    page,
    navList,
    logoInfo
  });
};
