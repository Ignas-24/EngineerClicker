import React, { useSyncExternalStore } from "react";
import game from "../../game/Game";
import Button from "../BottomLeft/Button/Button";
import CloseButton from "./CloseButton";
import styles from "./ProjectSelectMenu.module.css";
import getCached from "../../util/getCached";

const ProjectSelectMenu = ({ onClose }) => {
  const { projects, cooldown } = useSyncExternalStore(
    game.subscribe.bind(game),
    getCached(() => ({
      projects: game.projectManager.selectedProjects,
      cooldown: game.projectManager.cooldown,
    }))
  );
  
  const handleAction = (project) => {
    // TODO: All of this should be in the ProjectManager.js file
    if (project.active) {
      project.toggleActive();
      if (game.project === project) {
        game.project = null;
      }
      game.projectManager.selectedProjects = [
        ...game.projectManager.selectedProjects,
      ];

      game.notifyUpdate(); // this is very bad
      return;
    }
    const activeProject = game.projectManager.selectedProjects.find(
      (p) => p.active
    );
    if (activeProject) {
      alert(
        "A project is already active. Cancel it first before selecting a new project."
      );
      return;
    }
    project.toggleActive();
    game.project = project;
    game.projectManager.selectedProjects = [
      ...game.projectManager.selectedProjects,
    ];

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
      <CloseButton onClick={onClose} />
      {projects
        .filter((project) => !projects.some((p) => p.active) || project.active)
        .map((project) => (
          <Button
            key={project.dataName}
            label={
              project.active
                ? "Cancel Project"
                : `${project.projectName} - Size: ${project.projectSize}, Deadline: ${project.projectDeadline}, Reward: ${project.projectReward}€`
            }
            onClick={() => handleAction(project)}
          ></Button>
        ))}
      <br />
      <button onClick={handleRefresh}>
        {cooldown > 0 ? `Cooldown: ${cooldown}s` : "Refresh"}
      </button>
    </div>
  );
};

export default ProjectSelectMenu;
