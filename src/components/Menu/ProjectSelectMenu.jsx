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
      projects: game.projectManager.selectedProjects.map(
        (p, i) => ({
          id: i, 
          active: p.active, 
          dataName: p.dataName,
          projectName: p.projectName,
          projectSize: p.projectSize,
          projectDeadline: p.projectDeadline,
          projectReward: p.projectReward
        })
      ),
      cooldown: game.projectManager.cooldown,
    }))
  );
  
  const handleAction = (projectId) => {
    game.projectManager.toggleActive(projectId);
  };

  const handleRefresh = () => {
    game.projectManager.refreshProjects();
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
            onClick={() => handleAction(project.id)}
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
