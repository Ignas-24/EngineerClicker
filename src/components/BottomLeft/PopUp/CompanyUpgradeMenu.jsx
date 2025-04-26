import game from '../../../game/Game';
import Button from '../Button/Button';
import React, { useState, useEffect } from 'react';

const CompanyUpgradeMenu = ({ onClose }) => {
    const [upgrades, setUpgrades] = useState({ ...game.upgrades.companyUpgrades });

    const handleUpgrade = (upgradeKey) => {
        const success = game.upgrades.buyCompanyUpgrade(upgradeKey); 
        if (success) {
            setUpgrades({ ...game.upgrades.companyUpgrades });
        }
    };

    useEffect(() => {
        setUpgrades({ ...game.upgrades.companyUpgrades });
    }, [game.upgrades.companyUpgrades]);

    const upgradeOptions = {
        small: [
            { key: "reward", label: "Online marketing", effect: "10% project reward increase", cost: 1000, upkeep: 100 },
            { key: "size", label: "Requirement refinement", effect: "5% reduced project size", cost: 3000, upkeep: 100 },
            { key: "speed", label: "Mentorship program", effect: "20% developer speed increase", cost: 3000, upkeep: 100 },
            { key: "biggerProjects", label: "Client referrals", effect: "Base project sizes increased 2x", cost: 5000, upkeep: 100 },
        ],
        medium: [
            { key: "reward2", label: "Client feedback loop", effect: "10% project reward increase", cost: 1000, upkeep: 250 },
            { key: "size2", label: "Tech Stack Modernization", effect: "5% reduced project size", cost: 3000, upkeep: 250 },
            { key: "speed2", label: "Dev-ops pipeline", effect: "20% developer speed increase", cost: 10000, upkeep: 250 },
            { key: "biggerProjects2", label: "Government contracts", effect: "Base project sizes increased 2x", cost: 2000, upkeep: 250 },
        ],
        large: [
            { key: "reward3", label: "Time tracking software", effect: "10% project reward increase", cost: 1000, upkeep: 1000 },
            { key: "size3", label: "Scope creep protection", effect: "5% reduced project size", cost: 3000, upkeep: 1000 },
            { key: "speed3", label: "Remote work policy", effect: "20% developer speed increase", cost: 50000, upkeep: 1000 },
            { key: "biggerProjects3", label: "Global projects", effect: "Base project sizes increased 2x", cost: 75000, upkeep: 1000 },
        ],
    };

    const currentCompanyType = game.companyManager.currentCompany?.type;

    const validCompanyTypes = [];
    if (currentCompanyType === "large") validCompanyTypes.push("small", "medium", "large");
    else if (currentCompanyType === "medium") validCompanyTypes.push("small", "medium");
    else if (currentCompanyType === "small") validCompanyTypes.push("small");

    const availableUpgrades = validCompanyTypes.flatMap(type => upgradeOptions[type]);

    return (
        <div>
            <div>
                <h3>Company Upgrades</h3>
                {availableUpgrades.map((upgrade) => (
                    <React.Fragment key={upgrade.key}>
                        <Button
                            label={
                                upgrades[upgrade.key]
                                    ? `${upgrade.label} - Purchased`
                                    : `${upgrade.label} (${upgrade.cost} €)`
                            }
                            onClick={() => handleUpgrade(upgrade.key)}
                            disabled={upgrades[upgrade.key]}
                            title={`Effect: ${upgrade.effect}\nUpkeep Increase: ${upgrade.upkeep} €`}
                        />
                        <br />
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default CompanyUpgradeMenu;