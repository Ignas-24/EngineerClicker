import styles from './PopUp.module.css';
import game from '../../../game/Game';
import Button from '../Button/Button';
import React, { useState, useEffect } from 'react';

const DeveloperHiringPopUp = ({ onClose }) => {
    const [developers, setDevelopers] = useState({ ...game.companyManager.developers });

    const handleHireDeveloper = (tier) => {
        const success = game.companyManager.hireDeveloper(tier);
        if (success) {
            setDevelopers({ ...game.companyManager.developers });
        }
    };

    useEffect(() => {
        setDevelopers({ ...game.companyManager.developers });
    }, [game.companyManager.developers]);

    const developerOptions = [
        { tier: "junior", label: "Hire Junior Developer (€500, €100 upkeep)", efficiency: "+0.1 progress/sec" },
        { tier: "midlevel", label: "Hire Mid-Level Developer (€1,000, €200 upkeep)", efficiency: "+0.3 progress/sec" },
        { tier: "senior", label: "Hire Senior Developer (€2,000, €500 upkeep)", efficiency: "+0.7 progress/sec" },
        { tier: "lead", label: "Hire Lead Developer (€5,000, €1,000 upkeep)", efficiency: "+1.5 progress/sec, boosts others by 10%" },
    ];

    // Get the current company's unlocked developer tiers
    const unlockedTiers = game.companyManager.currentCompany?.unlocks || [];

    // Filter developer options based on unlocked tiers
    const availableDeveloperOptions = developerOptions.filter((developer) =>
        unlockedTiers.includes(developer.tier)
    );

    return (
        <div className={styles.Overlay}>
            <div className={styles.Modal}>
                <h3>Hire Developers</h3>
                {availableDeveloperOptions.map((developer) => (
                    <React.Fragment key={developer.tier}>
                        <Button
                            label={`${developer.label} (Hired: ${developers[developer.tier]})`}
                            onClick={() => handleHireDeveloper(developer.tier)}
                            title={`Efficiency: ${developer.efficiency}`}
                        />
                        <br />
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default DeveloperHiringPopUp;