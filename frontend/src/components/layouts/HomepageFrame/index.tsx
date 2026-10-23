import {ReactNode, Ref, useEffect} from "react";
import {Anchor} from "@mantine/core";
import {t} from "@lingui/macro";
import {HomepageThemeSettings} from "../../../types.ts";
import {SheetWidth} from "../../../constants/eventLayouts.ts";
import {homepageThemeStyle} from "../../../utilites/themeUtils.ts";
import {removeTransparency} from "../../../utilites/colorHelper.ts";
import {ensureHomepageFontLoaded} from "../../../utilites/fontLoader.ts";
import {getConfig} from "../../../utilites/config.ts";
import {PoweredByFooter} from "../../common/PoweredByFooter";
import {CookieSettingsLink} from "../../common/CookieSettingsLink";
import classes from "./HomepageFrame.module.scss";

interface HomepageFrameProps {
    themeSettings: HomepageThemeSettings;
    mirrorImageUrl?: string | null;
    footerSource: string;
    footerRef?: Ref<HTMLElement>;
    width?: SheetWidth;
    header?: ReactNode;
    outside?: ReactNode;
    children: ReactNode;
}

export const HomepageFrame = ({themeSettings, mirrorImageUrl, footerSource, footerRef, width = 'wide', header, outside, children}: HomepageFrameProps) => {
    useEffect(() => {
        ensureHomepageFontLoaded(themeSettings.font_family);
    }, [themeSettings.font_family]);

    const mirrorImage = themeSettings.background_type === 'MIRROR_COVER_IMAGE' ? mirrorImageUrl : null;

    return (
        <main className={classes.page} style={homepageThemeStyle(themeSettings)} data-mode={themeSettings.mode} data-width={width}>
            <style>
                {`
                    body, .ssr-loader {
                        background-color: ${removeTransparency(themeSettings.background)} !important;
                    }
                `}
            </style>
            <div
                className={classes.backdrop}
                aria-hidden="true"
                data-mirror={mirrorImage ? '' : undefined}
                style={mirrorImage ? {backgroundImage: `url(${mirrorImage})`} : undefined}
            />
            {header}
            <div className={classes.shell}>
                <article className={classes.sheet}>
                    {children}
                    <HomepageFooter source={footerSource} footerRef={footerRef}/>
                </article>
            </div>
            {outside}
        </main>
    );
};

const HomepageFooter = ({source, footerRef}: { source: string, footerRef?: Ref<HTMLElement> }) => (
    <footer ref={footerRef} className={classes.footer}>
        <PoweredByFooter className={classes.poweredBy}/>
        <div className={classes.footerLinks}>
            <Anchor href={getConfig('VITE_TOS_URL', `https://wednesdayriders.com/datenschutzerklaerung.html?utm_source=${source}`)} className={classes.footerLink}>
                {t`Privacy`}
            </Anchor>
            <Anchor href={getConfig('VITE_LEGAL_URL', `https://wednesdayriders.com/impressum.html?utm_source=${source}`)} className={classes.footerLink}>
                {t`Imprint`}
            </Anchor>
            <Anchor href={getConfig('VITE_DISCLAIMER_URL', `https://wednesdayriders.com/haftungsausschluss.html?utm_source=${source}`)} className={classes.footerLink}>
                {t`Disclaimer`}
            </Anchor>
            <CookieSettingsLink className={classes.footerLink}/>
        </div>
    </footer>
);
