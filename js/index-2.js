/// main index.js section
document.addEventListener("DOMContentLoaded", () => {

    let Loadsplash = document.querySelector(".v-splash");
    
    let isLoadPageRunning = false;
    loadLong();
    
      const createAction = (url, type, payload) => {
        const urlObj = new URL(url, window.location.href);
        const state = { page: urlObj.hash.slice(1) };
        history.pushState(state, "", urlObj.toString());
    
        return { type, payload };
      };
    
      const actions = {
        setCurrentPage: (page) => createAction(`#${page}`, SET_CURRENT_PAGE, page),
        showHome: () => createAction("#home", SHOW_HOME, "home"),
        setHomeContent: (html) => ({ type: SET_HOME_CONTENT, payload: html }),
        showLogin: () => createAction("#login", SHOW_LOGIN, "login"),
        logout: () => createAction("#logout", LOGOUT, "logout"),
        setLoginContent: (html) => ({ type: SET_LOGIN_CONTENT, payload: html }),
        showNewsfeed: () => createAction("#newsfeed", SHOW_NEWSFEED, "newsfeed"),
        setNewsfeedContent: (html) => ({
          type: SET_NEWSFEED_CONTENT,
          payload: html,
        }),
        showInsights: () => createAction("#insights", SHOW_INSIGHTS, "insights"),
        setInsightsContent: (html) => ({
          type: SET_INSIGHTS_CONTENT,
          payload: html,
        }),
        showCreate: () => createAction("#create", SHOW_CREATE, "create"),
        setCreateContent: (html) => ({ type: SET_CREATE_CONTENT, payload: html }),
        setOnboardingContent: (html) => ({
          type: SET_ONBOARDING_CONTENT,
          payload: html,
        }),
        showOnboarding: () =>
          createAction("#onboarding", SHOW_ONBOARDING, "onboarding"),
        setOnboardingStepsContent: (html) => ({
          type: SET_ONBOARDING_STEPS_CONTENT,
          payload: html,
        }),
        showOnboardingSteps: () =>
          createAction(
            "#onboardingSteps",
            SHOW_ONBOARDING_STEPS,
            "onboardingSteps"
          ),
      };
      const elements = {
        loginButton: document.querySelector(".login-button"),
        logoutButton: document.querySelector(".logout-button"),
        onboardingButton: document.querySelector("#toFeed-button"),
        toOnboardingForm: document.querySelector("#onboarding-button"),
        surfaceView: document.querySelector(".surface-view"),
        footer: document.querySelector(".footer-Contents"),
        insightsButton: document.querySelector(".lnk-ico .insights-btn"),
        createButton: document.querySelector(".lnk-ico .create-btn"),
        upNav: document.querySelector(".navbar-wrapper"),
        splash: document.querySelector(".v-splash"),
        refreshButtons: document.querySelectorAll(
          ".nav-logo, .nav-title, .VLOGO-wrapper"
        ),
      };
      const eventHandlers = {
        handleReirectDispatchOnLoad: () => {
    
          isLoadPageRunning = false;
          loadLong();
    
          const url = new URL(window.location.href);
          const pageName = url.hash ? url.hash.slice(1) : "home";
          url.pathname = getPagePath(pageName);
          url.hash = pageName;
          history.replaceState({}, document.title, `${url.hash}`);
    
          switch (pageName) {
            case "login":
              eventHandlers.handleLoginButtonClick();
              break;
            case "home":
              store.dispatch(actions.showHome());
              break;
            case "newsfeed":
              eventHandlers.handleNewsfeedButtonClick();
              break;
            case "insights":
              store.dispatch(actions.showInsights());
              break;
            case "create":
              store.dispatch(actions.showCreate());
              break;
            case "onboarding":
              eventHandlers.handleToOnboardFormClick();
              break;
            case "onboardingSteps":
              store.dispatch(actions.showOnboardingSteps());
              eventHandlers.onboardSuccess();
              break;
              default:
                // Show a popup alert
                console.warn(`Unknown page | REDIRECTING TO HOME: ${pageName}`);
                alert(`Unknown page | Click ok to go to [Home]: ${pageName}`);
              
                // Redirect the user to the home page
                store.dispatch(actions.showHome());
                break;
          }
    
          window.addEventListener("popstate", function (event) {
            const state = event.state;
            if (state) {
              window.location.reload();
            }
          });
    
    
        },
        handleLoginButtonClick: () => {
          loadPage("login", actions.showLogin(), actions.setLoginContent).then(() => {
            let loginSpace = document.querySelector(".login-Space");
            handleLoginFormSubmission(loginSpace);
    
            let waitListButton = document.querySelector("#waitList");
            waitListButton.addEventListener("click", () => {
              store.dispatch(actions.showHome()), window.location.reload();
            });
          });
        },
        handleToOnboardFormClick: () => {
    
          isLoadPageRunning = true;
          loadLong();
          
          setTimeout(() => {
            
            loadPage(
              "onboarding",
              actions.showOnboarding(),
              actions.setOnboardingContent
            ).then(() => {
              let onboardingSpace = document.querySelector(".onboarding-Space");
              handleOnboardingFormSubmission(onboardingSpace);
              isLoadPageRunning = false;
              elements.splash.style.display = "none";
            });
    
          }, 800);
    
        },
        handleNewsfeedButtonClick: () => {
    
    
          loadPage(
            "newsfeed",
            actions.showNewsfeed(),
            actions.setNewsfeedContent
          ).then(() => {
            isLoadPageRunning = false;
            updateNewsfeedNAV(true);
            eventHandlers.updateNewsfeedUI();
            updateNewsfeedNAV(newsfeedVisible) 
            
          });
    
        },
        handleInsightsButtonClick: () => {
          store.dispatch(actions.hideCreate());
          loadPage("insights", actions.showInsights, actions.setInsightsContent);
        },
        handleCreateButtonClick: () => {
          store.dispatch(actions.hideInsights());
          loadPage("create", actions.showCreate, actions.setCreateContent);
        },
        handleRefreshButtonClick: () => {
          store.dispatch(actions.showHome());
          window.location.reload();
        },
        handleNavSlideUpClick: () => {},
        addStepButtonListeners: () => {
          document
            .querySelectorAll(".onboarding-steps .nav-button.next")
            .forEach((button) => {
              button.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();
                eventHandlers.updateStep(1);
              });
            });
    
          document
            .querySelectorAll(".onboarding-steps .nav-button.back")
            .forEach((button) => {
              button.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();
                eventHandlers.updateStep(-1);
              });
            });
        },
        updateStep: (increment) => {
          stepMainAdjust();
    
          let steps = Array.from(
            document.querySelector(".onboarding-steps").querySelectorAll(".step")
          );
    
          let currentStep = steps.find((step) => step.classList.contains("active"));
    
          if (!currentStep) {
            steps.find((step) => step.dataset.step == "0").classList.add("active");
            return;
          }
    
          let currentStepNumber = parseInt(currentStep.dataset.step);
          let nextStepNumber = currentStepNumber + increment;
    
          let nextStep = steps.find(
            (step) => parseInt(step.dataset.step) === nextStepNumber
          );
    
          if (nextStep) {
            currentStep.classList.remove("active");
            nextStep.classList.add("active");
    
            if (parseInt(nextStep.dataset.step) === 5) {
              const stepFinishButtons = nextStep.querySelectorAll(".step-finish");
              if (stepFinishButtons) {
                stepFinishButtons.forEach(function (button) {
                  button.addEventListener("click", function () {
    
                    isLoadPageRunning = true;
                    loadLong();
              
                    setTimeout(() => {
                      alert(
                        "Prototype: Data is not connected. Proceeding to news feed..."
                      );
                        eventHandlers.handleNewsfeedButtonClick();
                    }, 800);
                   
    
                  });
                });
              }
            }
          }
        },
        successfulLogin: (loginNumberInput, passwordInput) => {
    
          loginNumberInput.value = "";
          passwordInput.value = "";
    
          isLoadPageRunning = true;
          loadLong();
    
          setTimeout(() => { 
            updateLoginUI(true);
            isLoadPageRunning = false;
            elements.splash.style.display = "none";
          }, 800);
         
        },
        onboardSuccess: () => {
    
          isLoadPageRunning = true;
          loadLong();
          
         
            setTimeout(() => {
    
              loadPage(
                "onboardingSteps",
                actions.showOnboardingSteps(),
                actions.setOnboardingStepsContent
              ).then(() => {
                eventHandlers.addStepButtonListeners();
                eventHandlers.updateStep();
                isLoadPageRunning = false;
                elements.splash.style.display = "none";
              });
    
            }, 700);
            
          
        },
        updateNewsfeedUI: () => {
          const LogOutButton = document.querySelector(".logout-button");
          LogOutButton.addEventListener("click", function () {
            alert("You are about to be logged out.");
            store.dispatch(actions.showHome());
            window.location.reload();
          });
    
          const newsfeedButton = document.querySelector(".newsfeed-button");
          newsfeedButton.addEventListener("click", function () {
            window.location.reload();
          });
    
          const navLink = document.querySelector("#hamBurg");
          const settingsModal = document.querySelector(".settings-modal");
          if (navLink && settingsModal) {
            navLink.addEventListener("click", function () {
              this.classList.toggle("active");
              settingsModal.classList.toggle("shown");
            });
          }
        },
        validateForm: (loginNumber, password, confirmPassword, nickname) => {
          if (!/^\d{2,9}$/.test(loginNumber)) {
            alert("Login Number should be between 2 and 9 digits.");
            return false;
          }
          if (!/^\d{2,9}$/.test(password)) {
            alert("Password should be between 2 and 9 digits.");
            return false;
          }
          if (password !== confirmPassword) {
            alert("Confirm Password should match Password.");
            return false;
          }
          if (nickname && !/^[a-zA-Z0-9._-]*$/.test(nickname)) {
            alert(
              "Nickname should be alphanumeric and may contain periods, dashes and underscores."
            );
            return false;
          }
          return {
            loginNumber,
            password,
            nickname,
          };
        },
        validateLoginForm: (loginNumber, password) => {
          if (!/^\d{3,9}$/.test(loginNumber)) {
            alert("Login Number should be between 3 and 9 digits.");
            return false;
          }
          if (!/^\d{3,9}$/.test(password)) {
            alert("Password should be between 3 and 9 digits.");
            return false;
          }
          if (loginNumber === "123456789" && password !== "123456") {
            alert("Please check your password.");
            return false;
          } else if (loginNumber === "123456789" && password === "123456") {
          
              eventHandlers.handleNewsfeedButtonClick();
      
          }
          return {
            loginNumber,
            password,
          };
        },
      };
    
      window.addEventListener("load", function () {
     
        eventHandlers.handleReirectDispatchOnLoad();
        
    
        if (elements.loginButton) {
          elements.loginButton.addEventListener(
            "click",
            eventHandlers.handleLoginButtonClick
          );
        }
        if (elements.logoutButton) {
          elements.logoutButton.addEventListener(
            "click",
            eventHandlers.handleLogoutButtonClick
          );
        }
        if (elements.insightsButton) {
          elements.insightsButton.addEventListener(
            "click",
            eventHandlers.handleInsightsButtonClick
          );
        }
        if (elements.createButton) {
          elements.createButton.addEventListener(
            "click",
            eventHandlers.handleCreateButtonClick
          );
        }
        if (elements.refreshButtons) {
          elements.refreshButtons.forEach((button) =>
            button.addEventListener("click", eventHandlers.handleRefreshButtonClick)
          );
        }
      });
    
      function displayLoadSplash() {
        // If the flag is set, display the splash screen and remove the flag
        if (!Loadsplash) return;
        Loadsplash.style.display = "flex";
        const hideSplashTime = Date.now() + 1100;
    
        const remainingTime = Math.max(0, hideSplashTime - Date.now());
        setTimeout(() => {
          elements.splash.style.display = "none";
          isLoadPageRunning = false;
        }, remainingTime)+100;
      }
      function displayLongSplash() {
        if (!elements.splash) return;
        elements.splash.style.display = "flex";
        let logo = document.querySelector(".v-logo");
        let rotationSpeed = 5;
        logo.style.animation = `rotate ${rotationSpeed}s linear infinite`;
        const hideSplashTime = Date.now() + 5000;
    
        const remainingTime = Math.max(0, hideSplashTime - Date.now());
        setTimeout(() => {
          elements.splash.style.display = "none";
          isLoadPageRunning = false;
          logo.style.animation = "";
        }, remainingTime);
      }
      function getPagePath(pageName) {
        const isHome = pageName === "home";
        const path = isHome ? "" : "./pages/";
        return `${path}${pageName}.html`;
      }
     
      function loadLong() {
        if (!isLoadPageRunning) {
          displayLoadSplash();
        } else if (isLoadPageRunning) {
          displayLongSplash();
        }
      }
      async function loadPage(pageName, actionToShow, actionToSetContent) {
        store.dispatch(actionToShow);
     
        try {
          const response = await fetch(getPagePath(pageName));
          const html = await response.text();
    
          store.dispatch(actionToSetContent(html));
          let pageSpace = document.querySelector(`.${pageName}-Space`);
          let homeScroll = document.querySelector(".Veras-surface");
    
          if (!pageSpace) {
            pageSpace = document.createElement("div");
            pageSpace.classList.add(`${pageName}-Space`, "fade-in");
            homeScroll.style.overflowY = "hidden";
    
            elements.surfaceView.insertBefore(
              pageSpace,
              elements.surfaceView.firstChild
            );
          }
    
          pageSpace.innerHTML = html;
          document.title = pageName.charAt(0).toUpperCase() + pageName.slice(1);
          elements.surfaceView.style.opacity = 0;
          pageSpace.style.height = "100dvh";
          pageSpace.style.width = "100%";
    
          elements.footer.style.display = "none";
          elements.surfaceView.innerHTML = "";
          elements.surfaceView.appendChild(pageSpace);
          await new Promise((resolve) => setTimeout(resolve, 50));
          pageSpace.classList.add("active");
          elements.surfaceView.style.opacity = 1;
        } catch (error) {
          console.error(error);
        }
      }
      function stepMainAdjust() {
        const stepMains = document.querySelectorAll(".step-main");
        if (stepMains.length > 0) {
          stepMains.forEach((stepMain) => {
            if (window.innerHeight < 500) {
              stepMain.style.setProperty("height", "auto", "important");
              console.log("Y is Less than 500px.step-main height is auto");
            } else {
              console.log("Y is greater than 500px, .step-main height 100%");
              stepMain.style.setProperty("height", "100%");
            }
          });
          return true;
        } else {
          return false;
        }
      }
      function updateLoginUI(isLoggedIn) {
       
        const formTitle = document.querySelector(".form-title");
        const ToFeedbtn = document.querySelector("#toFeed-button");
        const title = document.querySelector(".title h1");
        const buttonWrap = document.querySelector(".button-wrap");
    
        const loginNumberInput = document.querySelector("#login-number");
        const passwordInput = document.querySelector("#password");
    
        const onboardingButtonInner = document.querySelector("#onboarding-button");
    
        if (isLoggedIn) {
          onboardingButtonInner.style.display = "flex";
    
          formTitle.textContent = "Login Success";
          ToFeedbtn.style.display = "none";
          title.innerHTML = "Veras<span>Authentication</span>";
    
          loginNumberInput.style.display = "none";
          passwordInput.style.display = "none";
    
          const PMemo = document.createElement("p");
          PMemo.textContent = "Please change your password.";
          PMemo.style.whiteSpace = "pre-wrap";
          PMemo.style.marginBottom = "20px";
          PMemo.style.color = "var(--f7-theme-color)";
          buttonWrap.parentNode.insertBefore(PMemo, buttonWrap);
          isLoadPageRunning = false;
    
    
          /// GO TO ONBOARDING FORM
          onboardingButtonInner.addEventListener("click", () => {
            eventHandlers.handleToOnboardFormClick();
          });
        } else {
          onboardingButtonInner.style.display = "none";
        }
      }
      function updateNewsfeedNAV(newsfeedVisible) {
        const upNavNewsfeed = document.querySelector(".navbar-wrapper");
        if (newsfeedVisible) {
          upNavNewsfeed.style.display = "none";
        } else {
          upNavNewsfeed.style.display = "flex";
        }
      }
      function handleLoginFormSubmission(loginSpace) {
        if (!loginSpace.dataset.formEventAttached) {
          loginSpace.dataset.formEventAttached = "true";
    
          setTimeout(() => {
            const loginForm = document.querySelector(".form");
    
            if (loginForm) {
              loginForm.addEventListener("submit", (event) => {
                // Prevent form submission at the start of the event handler
                event.preventDefault();
    
                const loginNumberInput = document.querySelector("#login-number");
                const passwordInput = document.querySelector("#password");
    
                // Validate login number and password
                const loginNumber = loginNumberInput.value;
                const password = passwordInput.value;
    
                const formData = eventHandlers.validateLoginForm(
                  loginNumber,
                  password
                );
                if (!formData) {
                  // If form data is invalid, return early
                  return;
                }
    
                // Prepare the userLoginData object
                const userLoginData = {
                  loginNumber: formData.loginNumber,
                  password: formData.password,
                };
    
                // Send a POST request to login.phps
                fetch("http://study.veras.ca/logins.phps", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(userLoginData),
                })
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error("Network response was not ok");
                    }
                    return response.text();
                  })
                  .then((data) => {
                    //do something with the data
                  })
                  .catch((error) => {
                    // Handle errors here
                    if (error.message.includes("NetworkError")) {
                      alert("Network Error: Failed to reach the server.");
                    } else if (error.message.includes("TypeError")) {
                      alert(
                        "Type Error: There was a problem with the type of the input."
                      );
                    } else {
                      // Handle prototype error
                      alert(
                        "This is a prototype, data not connected. Please press OK to proceed."
                      );
                      
                      eventHandlers.successfulLogin(
                        loginNumberInput,
                        passwordInput
                      );
    
                    }
                  });
              });
            }
          }, 100);
        }
      }
      function handleOnboardingFormSubmission(onboardingSpace) {
        if (!onboardingSpace.dataset.formEventAttached) {
          onboardingSpace.dataset.formEventAttached = "true";
    
          setTimeout(() => {
          
            const onboardingForm = document.querySelector(".form");
            isLoadPageRunning = false;
    
            let waitListButton = document.querySelector("#waitList");
            waitListButton.addEventListener("click", () => {
              store.dispatch(actions.showHome()), window.location.reload();
            });
    
            if (onboardingForm) {
              isLoadPageRunning = false;
              elements.splash.style.display = "none";
    
              onboardingForm.addEventListener("submit", (event) => {
                // Prevent form submission at the start of the event handler
                event.preventDefault();
    
                const loginNumber = document.getElementById("login-number").value;
                const password = document.getElementById("password").value;
                const confirmPassword =
                  document.getElementById("confirm-password").value;
                const nickname = document.getElementById("nickname").value;
    
                const onboardUserData = eventHandlers.validateForm(
                  loginNumber,
                  password,
                  confirmPassword,
                  nickname
                );
    
                function postUserData(onboardUserData) {
                  return fetch("http://study.veras.ca/home.phps", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(onboardUserData),
                  }).then((response) => {
                    if (!response.ok) {
                      alert(onboardUserData); // onboardUserData contains the error message
                      throw new Error("Network response was not ok");
                    }
    
                    return response.text();
                  });
                }
    
                // Handle input field errors
                if (typeof onboardUserData === "string") {
                  console.log(onboardUserData);
                  return; // Stop the function here if there are validation errors
                }
    
                // Handle posting errors
                postUserData(onboardUserData)
                  .then((data) => {
                    console.log("postUserData", postUserData);
    
                    if (data.error) {
                      // Show the error message returned by postUserData()/ after saeed links it properly
                    }
                  })
                  .catch((error) => {
                    if (error.message.includes("NetworkError")) {
                      alert("Network Error: Failed to reach the server.");
                    } else {
                      // Handle prototype error
    
                      if (
                        onboardUserData &&
                        onboardUserData.loginNumber &&
                        onboardUserData.password
                      ) {
                        alert(
                          "This is a prototype, data not connected. Please press OK to proceed."
                        );
                        eventHandlers.onboardSuccess(
                          loginNumber,
                          password,
                          nickname
                        );
    
                        console.log("onboardUserData", onboardUserData);
                      }
                    }
                  });
              });
            }
          
          },100)
    
        }
      }
    
      //UI-UPDATES
      store.subscribe(() => {
        const state = store.getState();
        if (state.loginVisible) {
        } else if (state.newsfeedVisible) {
          updateNewsfeedNAV(true);
        } else if (state.onboardingStepsVisible || stepMainAdjust()) {
          window.addEventListener("resize", function () {
            stepMainAdjust();
          });
        } else if (state.onboardingVisible) {
        } else if (state.insightsVisible || state.createVisible) {
          let insightsNavLink = document
            .querySelector(".insights-btn")
            .closest(".nav-lnk");
          let createNavLink = document
            .querySelector(".create-btn")
            .closest(".nav-lnk");
          let insightsSpace = elements.surfaceView.querySelector(".insights-Space");
          let createSpace = elements.surfaceView.querySelector(".create-Space");
          let feedWrapper = elements.surfaceView.querySelector(".feed-wrapper");
    
          if (state.insightsVisible) {
            insightsNavLink.classList.add("btn-active");
            createNavLink.classList.remove("btn-active");
            if (!insightsSpace) {
              loadPage(
                "insights",
                actions.showInsights,
                actions.setInsightsContent
              );
            } else {
              insightsSpace.style.display = "block";
              if (createSpace) {
                createSpace.style.display = "none";
              }
            }
            feedWrapper.style.display = "none";
          } else if (state.createVisible) {
            createNavLink.classList.add("btn-active");
            insightsNavLink.classList.remove("btn-active");
            if (!createSpace) {
              loadPage("create", actions.showCreate, actions.setCreateContent);
            } else {
              createSpace.style.display = "block";
              if (insightsSpace) {
                insightsSpace.style.display = "none";
              }
            }
            feedWrapper.style.display = "none";
          } else {
            feedWrapper.style.display = "flex";
          }
        }
      });
    
    });