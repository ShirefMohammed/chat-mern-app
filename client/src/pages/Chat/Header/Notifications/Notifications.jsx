import { Fragment, useState } from "react";
import { Popover, Transition } from '@headlessui/react';

const Notifications = () => {
  const [notifications, setNotifications] = useState();

  return (
    <Popover.Group className="flex">
      <Popover className="relative">
        {/* Popover Button */}
        <Popover.Button className="flex items-center justify-center
          rounded-full w-8  h-8 text-sm bg-slate-100 text-black relative"
        >
          <i className="fa-solid fa-bell"></i>
          {
            notifications?.length > 0 &&
            <div className="absolute top-1 right-0 w-2 h-2 bg-orange-600
              rounded-full">
            </div>
          }
        </Popover.Button>

        {/* Popover Panel Transition */}
        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          {/* Popover Panel */}
          <Popover.Panel className="absolute -right-28 sm:right-0 top-full 
            z-10 mt-3 p-4 w-72 overflow-hidden rounded-md bg-white 
            shadow-lg ring-1 ring-gray-900/5 flex flex-col gap-2"
          >
            Popover Panel
          </Popover.Panel>
        </Transition>
      </Popover>
    </Popover.Group>
  )
}

export default Notifications
