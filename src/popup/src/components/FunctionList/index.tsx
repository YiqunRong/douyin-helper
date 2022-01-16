import { Switch, Typography } from '@douyinfe/semi-ui';

import useAutoShowCommentFunc from '../../hooks/useAutoShowCommentFunc';
import useEnhanceDescriptionFunc from '../../hooks/useEnhanceDescriptionFunc';

export default function FunctionList() {
  const autoShowCommentFunc = useAutoShowCommentFunc();
  const enhanceDescriptionFunc = useEnhanceDescriptionFunc();

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center gap-x-2">
        <Switch
          className="flex-none mt-[2px]"
          size="small"
          checked={autoShowCommentFunc.isEnabled}
          onChange={autoShowCommentFunc.updateStatus}
        />
        <Typography.Text className="whitespace-nowrap cursor-default">
          保持评论区展开
        </Typography.Text>
      </div>
      <div className="flex items-center gap-x-2">
        <Switch
          className="flex-none mt-[2px]"
          size="small"
          checked={enhanceDescriptionFunc.isEnabled}
          onChange={enhanceDescriptionFunc.updateStatus}
        />
        <Typography.Text className="whitespace-nowrap cursor-default">
          优化视频描述
        </Typography.Text>
      </div>
    </div>
  );
}
