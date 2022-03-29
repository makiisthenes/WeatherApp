import React from 'react';
import '../css/top_bar.css';
import menu from "../images/logo.svg";
import retry from "../images/retry.svg";

export function TopBar() {
    // Function to display the top Nav Bar which never changes
    return (
        <section id="TopBar">
            <div id="top_bar_container" className="flex_parent flex_vcenter flex_hbetween">
                <div id="menu_btn_wrapper"><img src={menu} alt='menu'/></div>
                <div id="logo_title_wrapper">
                    <h2 id="logo_title">Weather</h2>
                </div>
                <div id="map_btn_wrapper"><img src={retry} alt='compass'/></div>
            </div>
        </section>
    )
}