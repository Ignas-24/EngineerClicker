import React from "react";
import game from '../../game/Game';
import Button from '../BottomLeft/Button/Button';
import { useState, useSyncExternalStore } from 'react';
import styles from './ProjectSelectMenu.module.css';

const ProjectMenu = ({ onClose }) => {
    const projects = useSyncExternalStore(
        game.subscribe.bind(game),
        () => game.projectManager.selectedProjects
    );

    const cooldown = useSyncExternalStore(
        game.subscribe.bind(game),
        () => game.projectManager.cooldown
    );

    const handleAction = (project) => {
        if (project.active) {
          project.toggleActive(); 
          if (game.project === project) {
            game.project = null;
          }
          game.projectManager.selectedProjects = [...game.projectManager.selectedProjects];

          game.notifyUpdate();
          return;
        }
        const activeProject = game.projectManager.selectedProjects.find(p => p.active);
        if (activeProject) {
          alert("A project is already active. Cancel it first before selecting a new project.");
          return;
        }
        project.toggleActive();
        game.project = project;
        game.projectManager.selectedProjects = [...game.projectManager.selectedProjects];

        game.notifyUpdate();
      };

    const handleRefresh = () => {
        if (cooldown === 0) {
            game.projectManager.selectProjects();
            game.projectManager.startTimer(60);
        }
    };

    return (
        <div className={styles.buttonsContainer}>
            {projects
                .filter(project => !projects.some(p => p.active) || project.active)
                .map((project) => (
                    <Button
                        key={project.dataName}
                        label={project.active
                            ? "Cancel Project"
                            : `${project.projectName} - Size: ${project.projectSize}, Deadline: ${project.projectDeadline}, Reward: ${project.projectReward}€`}
                        onClick={() => handleAction(project)}
                    >
                    </Button>
                ))}
            <br />
            <button onClick={handleRefresh}>
                {cooldown > 0 ? `Cooldown: ${cooldown}s` : "Refresh"}
            </button>
        </div>
    );
}

export default ProjectMenu;