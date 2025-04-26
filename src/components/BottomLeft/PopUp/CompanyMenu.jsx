import game from '../../../game/Game';
import Button from '../Button/Button';
import React, { useState, useSyncExternalStore } from "react";
import CompanyUpgradeMenu from './CompanyUpgradeMenu';
import DeveloperHiringMenu from './DeveloperHiringMenu';

const CompanyMenu = ({ onClose }) => {

    const [isUpgradeOpen, setUpgradeOpen] = useState(false);
    const [isDeveloperOpen, setDeveloperOpen] = useState(false);

    const currentCompany = useSyncExternalStore(
        game.subscribe.bind(game),
        () => game.companyManager.currentCompany
    );
    const handleBuyCompany = (type) => {
        game.companyManager.buyCompany(type);
    };


    const completedProjectsThisReset = useSyncExternalStore(
        game.subscribe.bind(game),
        () => game.projectManager.completedProjectsThisReset
    );

    return (
        <div>
            <div>
                <h4>Completed Projects: {completedProjectsThisReset}</h4>
                {!currentCompany && (
                    <Button
                        label="Buy Small Software Development Studio (5,000 €)"
                        onClick={() => handleBuyCompany("small")}
                    />
                )}
                {currentCompany?.type === "small" && (
                    <Button
                        label="Upgrade to Medium Sized Software Company (20,000 €)"
                        onClick={() => handleBuyCompany("medium")}
                    />
                )}
                {currentCompany?.type === "medium" && (
                    <Button
                        label="Upgrade to Large Software Corporation (100,000 €)"
                        onClick={() => handleBuyCompany("large")}
                    />
                )}
                {currentCompany && (
                    <>
                        <Button label="Company upgrades" onClick={() => setUpgradeOpen(!isUpgradeOpen)} />
                        {isUpgradeOpen && <CompanyUpgradeMenu onClose={() => setUpgradeOpen(false)} />}
                    </>
                )}
                {currentCompany && (
                    <>
                        <Button label="Hire developers" onClick={() => setDeveloperOpen(!isDeveloperOpen)} />
                        {isDeveloperOpen && <DeveloperHiringMenu onClose={() => setDeveloperOpen(false)} />}
                    </>
                )}
                {currentCompany && (currentCompany.type === "medium" || currentCompany.type === "large") && completedProjectsThisReset >= 40 && (completedProjectsThisReset - 40) % 10 === 0 && (
                    <>
                        <Button
                            label="Sell Company"
                            onClick={() => {
                                const confirmSell = confirm("Are you sure you want to sell your company?");
                                if (confirmSell) {
                                    game.companyManager.sellCompany();
                                }
                            }}
                        />
                    </>
                )}
                <br />
            </div>
        </div>
    );
};


export default CompanyMenu;