import React from 'react';

const Footer = () => {
  return (
    <div className="footer__content">
      <div className="footer__content-row">
        <h3 className="footer__content-heading">
          Contact
        </h3>
        <p className="footer-text">For information and comments, please contact Van Albert at van@vanalbert.com</p>
        <h3 className="footer__content-heading">
          Site Info
        </h3>
        <p className="footer-text">This website is powered by <span className="semibold">React</span>. Site design, layout, graphics and HTML/CSS/JavaScript implementation by Van Albert. No CSS frameworks or libraries were used on this site. </p>
      </div>

      <h3 className="footer__content-heading">
      About the Avatar
      </h3>
      <p className="footer-text">
        The avatar photo was taken on the Ben Franklin Bridge in Philadelphia on a Sunday morning in 2008 at about 40mpg with a Panasonic GS320 DV Tape camera, years before anyone had heard of the GoPro. I designed and built the camera mount, drove the sidecar rig, edited the photo and video, and fed the dog myself.
      </p>

      <div className="footer__content-row">
        <hr className="horiz-rule"></hr>
        <p className="footer-text"><span className="semibold">Sidecar Companion</span>, <span className="semibold">Sidecar Companion for HTML Email</span>, and the <span className="semibold">Sidecar Companion</span> logo are trademarks of&nbsp;witty&#8209;js.com.</p>
        <p className="footer-text">Website content &copy;2021 vanalbert.com</p>

      </div>
    </div>
  );
};

export default Footer;